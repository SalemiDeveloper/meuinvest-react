import * as XLSX from '@stackline/xlsx';

export type ExcelRow = Record<string, unknown>;

export async function readExcelFile(file: File): Promise<ExcelRow[]> {
    const arrayBuffer = await file.arrayBuffer();

    const workbook = XLSX.read(arrayBuffer, {
        type: 'array',
    });

    const sheetName = 'Posição - Renda Fixa';
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
        throw new Error(
            `A planilha "${sheetName}" não foi encontrada no arquivo.`,
        );
    }

    return XLSX.utils.sheet_to_json<ExcelRow>(worksheet, {
        defval: null,
    });
}