import { useEffect, useMemo, useState } from 'react';

import { getInvestmentImportsWithPositions } from '../../services/investments';

import type {
    InvestmentImportWithPositions,
    InvestmentPosition,
} from '../../types/investments';

import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';

import './InvestmentAnalysis.css';

type InvestmentOption = {
    key: string;
    position: InvestmentPosition;
};

type InvestmentHistoryItem = {
    report: InvestmentImportWithPositions;
    position: InvestmentPosition;
    value: number;
    difference: number | null;
    variationPercentage: number | null;
};

function formatReferencePeriod(value: string): string {
    const date = new Date(`${value}T00:00:00`);

    return date.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
    });
}

function formatPercentage(value: number): string {
    return `${value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}%`;
}

function formatSignedCurrency(value: number): string {
    if (value > 0) {
        return `+${formatCurrency(value)}`;
    }

    return formatCurrency(value);
}

function formatSignedPercentage(value: number): string {
    if (value > 0) {
        return `+${formatPercentage(value)}`;
    }

    return formatPercentage(value);
}

function getValueClass(value: number | null): string {
    if (value === null || value === 0) {
        return '';
    }

    return value > 0 ? 'positive' : 'negative';
}

function getInvestmentKey(
    position: InvestmentPosition,
): string {
    if (position.code) {
        return position.code;
    }

    return [
        position.product,
        position.institution,
        position.issuer,
    ]
        .filter(Boolean)
        .join('|');
}

function calculateVariationPercentage(
    previousValue: number,
    currentValue: number,
): number {
    if (previousValue === 0) {
        return currentValue === 0 ? 0 : 100;
    }

    return (
        ((currentValue - previousValue) / previousValue) *
        100
    );
}

function InvestmentAnalysis() {
    const [reports, setReports] = useState<
        InvestmentImportWithPositions[]
    >([]);

    const [selectedInvestmentKey, setSelectedInvestmentKey] =
        useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadReports = async () => {
            try {
                setLoading(true);
                setError(null);

                const data =
                    await getInvestmentImportsWithPositions();

                setReports(data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Não foi possível carregar os investimentos.',
                );
            } finally {
                setLoading(false);
            }
        };

        loadReports();
    }, []);

    /*
     * Os investimentos disponíveis são montados a partir
     * de todos os relatórios.
     *
     * Quando o mesmo investimento aparece em vários meses,
     * mantemos a posição mais recente para representar
     * os dados atuais do investimento.
     */
    const investmentOptions = useMemo(() => {
        const orderedReports = [...reports].sort(
            (a, b) =>
                b.reference_period.localeCompare(
                    a.reference_period,
                ),
        );

        const investments = new Map<
            string,
            InvestmentOption
        >();

        orderedReports.forEach((report) => {
            report.positions.forEach((position) => {
                const key = getInvestmentKey(position);

                if (!investments.has(key)) {
                    investments.set(key, {
                        key,
                        position,
                    });
                }
            });
        });

        return Array.from(investments.values()).sort((a, b) =>
            a.position.product.localeCompare(
                b.position.product,
            ),
        );
    }, [reports]);

    const selectedInvestment = useMemo(() => {
        return (
            investmentOptions.find(
                (investment) =>
                    investment.key ===
                    selectedInvestmentKey,
            ) ?? null
        );
    }, [investmentOptions, selectedInvestmentKey]);

    /*
     * Relatórios em ordem cronológica para montar
     * o histórico do investimento.
     */
    const history = useMemo<InvestmentHistoryItem[]>(() => {
        if (!selectedInvestment) {
            return [];
        }

        const orderedReports = [...reports].sort(
            (a, b) =>
                a.reference_period.localeCompare(
                    b.reference_period,
                ),
        );

        const result: InvestmentHistoryItem[] = [];

        let previousValue: number | null = null;

        orderedReports.forEach((report) => {
            const position = report.positions.find(
                (currentPosition) =>
                    getInvestmentKey(currentPosition) ===
                    selectedInvestment.key,
            );

            if (!position) {
                return;
            }

            const value = Number(position.curve_value);

            let difference: number | null = null;
            let variationPercentage: number | null = null;

            if (previousValue !== null) {
                difference = value - previousValue;

                variationPercentage =
                    calculateVariationPercentage(
                        previousValue,
                        value,
                    );
            }

            result.push({
                report,
                position,
                value,
                difference,
                variationPercentage,
            });

            previousValue = value;
        });

        return result;
    }, [reports, selectedInvestment]);

    const firstRecord = history[0];
    const latestRecord =
        history[history.length - 1];

    const variation = useMemo(() => {
        if (!firstRecord || !latestRecord) {
            return {
                value: 0,
                percentage: 0,
            };
        }

        const value =
            latestRecord.value - firstRecord.value;

        const percentage =
            firstRecord.value === 0
                ? latestRecord.value === 0
                    ? 0
                    : 100
                : (value / firstRecord.value) * 100;

        return {
            value,
            percentage,
        };
    }, [firstRecord, latestRecord]);

    if (loading) {
        return (
            <main className="investment-analysis">
                <p>
                    Carregando histórico do investimento...
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="investment-analysis">
                <p className="investment-analysis-error">
                    {error}
                </p>
            </main>
        );
    }

    return (
        <main className="investment-analysis">
            <header className="investment-analysis-header">
                <h1>Histórico do investimento</h1>

                <p>
                    Selecione um investimento para acompanhar
                    seus valores nos relatórios importados.
                </p>
            </header>

            {investmentOptions.length === 0 ? (
                <section className="investment-analysis-empty">
                    <p>
                        Ainda não existem investimentos
                        importados para análise.
                    </p>
                </section>
            ) : (
                <>
                    <section className="investment-analysis-selector">
                        <label htmlFor="investment">
                            Investimento
                        </label>

                        <select
                            id="investment"
                            value={selectedInvestmentKey}
                            onChange={(event) =>
                                setSelectedInvestmentKey(
                                    event.target.value,
                                )
                            }
                        >
                            <option value="">
                                Selecione um investimento
                            </option>
                            
                            {investmentOptions.map(
                                (investment) => (
                                    <option
                                        key={investment.key}
                                        value={investment.key}
                                    >
                                        {
                                            investment.position
                                                .product
                                        }
                                        {' — '}
                                        {
                                            investment.position
                                                .institution
                                        }
                                    </option>
                                ),
                            )}
                        </select>
                    </section>

                    {selectedInvestment &&
                        latestRecord && (
                            <>
                                <section className="investment-analysis-info">
                                    <div className="investment-analysis-section-header">
                                        <h2>
                                            Informações do
                                            investimento
                                        </h2>

                                        <p>
                                            Dados registrados no
                                            relatório mais
                                            recente.
                                        </p>
                                    </div>

                                    <div className="investment-analysis-info-grid">
                                        <div>
                                            <span>Produto</span>

                                            <strong>
                                                {
                                                    latestRecord
                                                        .position
                                                        .product
                                                }
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Instituição
                                            </span>

                                            <strong>
                                                {latestRecord
                                                    .position
                                                    .institution ??
                                                    '-'}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Emissor</span>

                                            <strong>
                                                {latestRecord
                                                    .position
                                                    .issuer ??
                                                    '-'}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Código</span>

                                            <strong>
                                                {latestRecord
                                                    .position
                                                    .code ?? '-'}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Indexador</span>

                                            <strong>
                                                {latestRecord
                                                    .position
                                                    .indexer ??
                                                    '-'}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Data de emissão
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    latestRecord
                                                        .position
                                                        .issued_at,
                                                )}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Vencimento
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    latestRecord
                                                        .position
                                                        .maturity_date,
                                                )}
                                            </strong>
                                        </div>
                                    </div>
                                </section>

                                <section className="investment-analysis-cards">
                                    <article className="investment-analysis-card">
                                        <span>
                                            Primeiro valor
                                            registrado
                                        </span>

                                        <strong>
                                            {formatCurrency(
                                                firstRecord.value,
                                            )}
                                        </strong>

                                        <small>
                                            {formatReferencePeriod(
                                                firstRecord
                                                    .report
                                                    .reference_period,
                                            )}
                                        </small>
                                    </article>

                                    <article className="investment-analysis-card">
                                        <span>
                                            Valor mais recente
                                        </span>

                                        <strong>
                                            {formatCurrency(
                                                latestRecord.value,
                                            )}
                                        </strong>

                                        <small>
                                            {formatReferencePeriod(
                                                latestRecord
                                                    .report
                                                    .reference_period,
                                            )}
                                        </small>
                                    </article>

                                    <article className="investment-analysis-card">
                                        <span>
                                            Variação desde o
                                            primeiro registro
                                        </span>

                                        <strong
                                            className={getValueClass(
                                                variation.value,
                                            )}
                                        >
                                            {formatSignedCurrency(
                                                variation.value,
                                            )}
                                        </strong>

                                        <small
                                            className={getValueClass(
                                                variation.percentage,
                                            )}
                                        >
                                            {formatSignedPercentage(
                                                variation.percentage,
                                            )}
                                        </small>
                                    </article>
                                </section>

                                <section className="investment-analysis-chart-section">
                                    <div className="investment-analysis-section-header">
                                        <h2>
                                            Evolução do valor
                                        </h2>

                                        <p>
                                            Histórico do Valor
                                            Atualizado CURVA nos
                                            relatórios
                                            encontrados.
                                        </p>
                                    </div>

                                    <div className="investment-analysis-chart">
                                        <svg
                                            viewBox="0 0 1000 300"
                                            preserveAspectRatio="none"
                                        >
                                            {(() => {
                                                const values =
                                                    history.map(
                                                        (item) =>
                                                            item.value,
                                                    );

                                                const maxValue =
                                                    Math.max(
                                                        ...values,
                                                    );

                                                const minValue =
                                                    Math.min(
                                                        ...values,
                                                    );

                                                const range =
                                                    maxValue -
                                                        minValue ||
                                                    1;

                                                const chartLeft = 55;
                                                const chartRight = 980;
                                                const chartTop = 25;
                                                const chartBottom = 240;

                                                const getX = (
                                                    index: number,
                                                ) => {
                                                    if (
                                                        history.length ===
                                                        1
                                                    ) {
                                                        return (
                                                            (chartLeft +
                                                                chartRight) /
                                                            2
                                                        );
                                                    }

                                                    return (
                                                        chartLeft +
                                                        (index /
                                                            (history.length -
                                                                1)) *
                                                            (chartRight -
                                                                chartLeft)
                                                    );
                                                };

                                                const getY = (
                                                    value: number,
                                                ) =>
                                                    chartBottom -
                                                    ((value -
                                                        minValue) /
                                                        range) *
                                                        (chartBottom -
                                                            chartTop);

                                                const points =
                                                    history
                                                        .map(
                                                            (
                                                                item,
                                                                index,
                                                            ) =>
                                                                `${getX(
                                                                    index,
                                                                )},${getY(
                                                                    item.value,
                                                                )}`,
                                                        )
                                                        .join(
                                                            ' ',
                                                        );

                                                return (
                                                    <>
                                                        {[
                                                            0,
                                                            1,
                                                            2,
                                                            3,
                                                            4,
                                                        ].map(
                                                            (
                                                                line,
                                                            ) => {
                                                                const y =
                                                                    chartTop +
                                                                    (line /
                                                                        4) *
                                                                        (chartBottom -
                                                                            chartTop);

                                                                const value =
                                                                    maxValue -
                                                                    (line /
                                                                        4) *
                                                                        range;

                                                                return (
                                                                    <g
                                                                        key={
                                                                            line
                                                                        }
                                                                    >
                                                                        <line
                                                                            x1={
                                                                                chartLeft
                                                                            }
                                                                            x2={
                                                                                chartRight
                                                                            }
                                                                            y1={
                                                                                y
                                                                            }
                                                                            y2={
                                                                                y
                                                                            }
                                                                            className="investment-chart-grid-line"
                                                                        />

                                                                        <text
                                                                            x={
                                                                                chartLeft -
                                                                                10
                                                                            }
                                                                            y={
                                                                                y +
                                                                                4
                                                                            }
                                                                            textAnchor="end"
                                                                            className="investment-chart-axis-label"
                                                                        >
                                                                            {formatCurrency(
                                                                                value,
                                                                            )}
                                                                        </text>
                                                                    </g>
                                                                );
                                                            },
                                                        )}

                                                        {history.map(
                                                            (
                                                                item,
                                                                index,
                                                            ) => {
                                                                const x =
                                                                    getX(
                                                                        index,
                                                                    );

                                                                return (
                                                                    <g
                                                                        key={
                                                                            item
                                                                                .report
                                                                                .id
                                                                        }
                                                                    >
                                                                        <line
                                                                            x1={
                                                                                x
                                                                            }
                                                                            x2={
                                                                                x
                                                                            }
                                                                            y1={
                                                                                chartTop
                                                                            }
                                                                            y2={
                                                                                chartBottom
                                                                            }
                                                                            className="investment-chart-grid-line"
                                                                        />

                                                                        <text
                                                                            x={
                                                                                x
                                                                            }
                                                                            y={
                                                                                chartBottom +
                                                                                22
                                                                            }
                                                                            textAnchor="middle"
                                                                            className="investment-chart-axis-label"
                                                                        >
                                                                            {item
                                                                                .report
                                                                                .reference_period
                                                                                .slice(
                                                                                    0,
                                                                                    7,
                                                                                )}
                                                                        </text>
                                                                    </g>
                                                                );
                                                            },
                                                        )}

                                                        {history.length >
                                                            1 && (
                                                            <polyline
                                                                points={
                                                                    points
                                                                }
                                                                className="investment-chart-line"
                                                            />
                                                        )}

                                                        {history.map(
                                                            (
                                                                item,
                                                                index,
                                                            ) => (
                                                                <circle
                                                                    key={
                                                                        item
                                                                            .report
                                                                            .id
                                                                    }
                                                                    cx={getX(
                                                                        index,
                                                                    )}
                                                                    cy={getY(
                                                                        item.value,
                                                                    )}
                                                                    r="4"
                                                                    className="investment-chart-point"
                                                                />
                                                            ),
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </svg>
                                    </div>
                                </section>

                                <section className="investment-analysis-history">
                                    <div className="investment-analysis-section-header">
                                        <h2>
                                            Histórico de valores
                                        </h2>

                                        <p>
                                            Valores registrados em
                                            cada relatório
                                            importado.
                                        </p>
                                    </div>

                                    <div className="investment-analysis-table-wrapper">
                                        <table className="investment-analysis-table">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        Período
                                                    </th>

                                                    <th>
                                                        Valor CURVA
                                                    </th>

                                                    <th>
                                                        Variação
                                                    </th>

                                                    <th>
                                                        Variação %
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {history
                                                    .slice()
                                                    .reverse()
                                                    .map(
                                                        (
                                                            item,
                                                        ) => (
                                                            <tr
                                                                key={
                                                                    item
                                                                        .report
                                                                        .id
                                                                }
                                                            >
                                                                <td>
                                                                    {formatReferencePeriod(
                                                                        item
                                                                            .report
                                                                            .reference_period,
                                                                    )}
                                                                </td>

                                                                <td>
                                                                    {formatCurrency(
                                                                        item.value,
                                                                    )}
                                                                </td>

                                                                <td
                                                                    className={getValueClass(
                                                                        item.difference,
                                                                    )}
                                                                >
                                                                    {item.difference ===
                                                                    null
                                                                        ? '—'
                                                                        : formatSignedCurrency(
                                                                              item.difference,
                                                                          )}
                                                                </td>

                                                                <td
                                                                    className={getValueClass(
                                                                        item.variationPercentage,
                                                                    )}
                                                                >
                                                                    {item.variationPercentage ===
                                                                    null
                                                                        ? '—'
                                                                        : formatSignedPercentage(
                                                                              item.variationPercentage,
                                                                          )}
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </>
                        )}
                </>
            )}
        </main>
    );
}

export default InvestmentAnalysis;