import type { InvestmentPosition } from '../types/investments';
import type { ExcelRow } from './excel';

import { parseBrazilianDate } from '../utils/date';
import { parseCurveValue } from '../utils/number';

const REQUIRED_COLUMNS = [
    'Produto',
    'Instituição',
    'Emissor',
    'Código',
    'Indexador',
    'Data de Emissão',
    'Vencimento',
    'Valor Atualizado CURVA',
];

function getStringValue(
    row: ExcelRow,
    column: string,
): string | null {
    const value = row[column];

    if (value === null || value === undefined) {
        return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
}

export function validateB3Report(rows: ExcelRow[]): void {
    if (rows.length === 0) {
        throw new Error(
            'O relatório não possui dados para importação.',
        );
    }

    const columns = Object.keys(rows[0]);

    const missingColumns = REQUIRED_COLUMNS.filter(
        (column) => !columns.includes(column),
    );

    if (missingColumns.length > 0) {
        throw new Error(
            `O relatório não possui as colunas obrigatórias: ${missingColumns.join(', ')}.`,
        );
    }
}

export function parseInvestmentPositions(
    rows: ExcelRow[],
): Omit<InvestmentPosition, 'id' | 'investment_import_id'>[] {
    return rows
        .filter((row) => {
            const product = getStringValue(row, 'Produto');

            return product !== null;
        })
        .map((row) => {
            const product = getStringValue(row, 'Produto');
            const curveValue = row['Valor Atualizado CURVA'];

            if (!product) {
                throw new Error(
                    'Foi encontrada uma posição sem produto válido.',
                );
            }

            if (
                curveValue === null ||
                curveValue === undefined ||
                curveValue === ''
            ) {
                throw new Error(
                    `O investimento "${product}" não possui o campo "Valor Atualizado CURVA".`,
                );
            }

            return {
                product,
                institution: getStringValue(row, 'Instituição'),
                issuer: getStringValue(row, 'Emissor'),
                code: getStringValue(row, 'Código'),
                indexer: getStringValue(row, 'Indexador'),

                issued_at: parseBrazilianDate(
                    getStringValue(row, 'Data de Emissão'),
                ),

                maturity_date: parseBrazilianDate(
                    getStringValue(row, 'Vencimento'),
                ),

                curve_value: parseCurveValue(curveValue),
            };
        });
}