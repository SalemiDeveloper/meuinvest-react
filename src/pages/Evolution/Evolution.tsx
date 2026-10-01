import { useEffect, useMemo, useState } from 'react';

import { getInvestmentImportsWithPositions } from '../../services/investments';
import type { InvestmentImportWithPositions } from '../../types/investments';
import { formatCurrency } from '../../utils/currency';

import './Evolution.css';

type EvolutionItem = {
    report: InvestmentImportWithPositions;
    total: number;
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

function formatReferencePeriodTitle(value: string): string {
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

function getValueClass(value: number | null): string {
    if (value === null || value === 0) {
        return '';
    }

    return value > 0 ? 'positive' : 'negative';
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

function calculateTotal(
    report: InvestmentImportWithPositions,
): number {
    return report.positions.reduce(
        (total, position) =>
            total + Number(position.curve_value),
        0,
    );
}

function Evolution() {
    const [reports, setReports] = useState<
        InvestmentImportWithPositions[]
    >([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadEvolution = async () => {
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
                        : 'Não foi possível carregar a evolução da carteira.',
                );
            } finally {
                setLoading(false);
            }
        };

        loadEvolution();
    }, []);

    const evolution = useMemo<EvolutionItem[]>(() => {
        const orderedReports = [...reports].sort(
            (a, b) =>
                a.reference_period.localeCompare(
                    b.reference_period,
                ),
        );

        return orderedReports.map((report, index) => {
            const total = calculateTotal(report);

            if (index === 0) {
                return {
                    report,
                    total,
                    difference: null,
                    variationPercentage: null,
                };
            }

            const previousTotal = calculateTotal(
                orderedReports[index - 1],
            );

            const difference = total - previousTotal;

            const variationPercentage =
                previousTotal === 0
                    ? total === 0
                        ? 0
                        : 100
                    : (difference / previousTotal) * 100;

            return {
                report,
                total,
                difference,
                variationPercentage,
            };
        });
    }, [reports]);

    const current = evolution[evolution.length - 1];
    const first = evolution[0];

    const highest = useMemo(() => {
        if (evolution.length === 0) {
            return null;
        }

        return evolution.reduce((highestItem, item) =>
            item.total > highestItem.total
                ? item
                : highestItem,
        );
    }, [evolution]);

    const periodGrowth =
        current && first
            ? current.total - first.total
            : 0;

    if (loading) {
        return (
            <main className="evolution">
                <p>Carregando evolução da carteira...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="evolution">
                <p className="evolution-error">{error}</p>
            </main>
        );
    }

    return (
        <main className="evolution">
            <header className="evolution-header">
                <h1>Evolução da carteira</h1>

                <p>
                    Acompanhe a evolução do valor total registrado
                    nos seus relatórios mensais.
                </p>
            </header>

            {evolution.length === 0 ? (
                <section className="evolution-empty">
                    <p>
                        Ainda não existem relatórios importados
                        para acompanhar a evolução da carteira.
                    </p>
                </section>
            ) : (
                <>
                    <section className="evolution-cards">
                        <article className="evolution-card">
                            <span>Patrimônio atual</span>

                            <strong>
                                {formatCurrency(current.total)}
                            </strong>

                            <small>
                                {formatReferencePeriod(
                                    current.report.reference_period,
                                )}
                            </small>
                        </article>

                        <article className="evolution-card">
                            <span>Primeiro registro</span>

                            <strong>
                                {formatCurrency(first.total)}
                            </strong>

                            <small>
                                {formatReferencePeriod(
                                    first.report.reference_period,
                                )}
                            </small>
                        </article>

                        <article className="evolution-card">
                            <span>Crescimento no período</span>

                            <strong
                                className={getValueClass(
                                    periodGrowth,
                                )}
                            >
                                {formatSignedCurrency(
                                    periodGrowth,
                                )}
                            </strong>

                            <small>
                                Diferença entre o primeiro e o
                                último registro
                            </small>
                        </article>

                        <article className="evolution-card">
                            <span>Maior patrimônio registrado</span>

                            {highest && (
                                <>
                                    <strong>
                                        {formatCurrency(
                                            highest.total,
                                        )}
                                    </strong>

                                    <small>
                                        Variação acumulada:{' '}
                                        {formatSignedPercentage(
                                            highest.total !== 0
                                                ? ((highest.total -
                                                    first.total) /
                                                    first.total) *
                                                100
                                                : 0,
                                        )}
                                    </small>
                                </>
                            )}
                        </article>
                    </section>

                    <section className="evolution-chart-section">
                        <div className="evolution-section-header">
                            <h2>Histórico do patrimônio</h2>

                            <p>
                                Valor total CURVA registrado em
                                cada relatório importado.
                            </p>
                        </div>

                        <div className="evolution-chart">
                            <svg
                                viewBox="0 0 1000 300"
                                preserveAspectRatio="none"
                            >
                                {(() => {
                                    const values = evolution.map(
                                        (item) => item.total,
                                    );

                                    const maxValue = Math.max(
                                        ...values,
                                    );

                                    const minValue = Math.min(
                                        ...values,
                                    );

                                    const range =
                                        maxValue - minValue ||
                                        1;

                                    const chartLeft = 55;
                                    const chartRight = 980;
                                    const chartTop = 25;
                                    const chartBottom = 240;

                                    const getX = (
                                        index: number,
                                    ) => {
                                        if (
                                            evolution.length ===
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
                                                (evolution.length -
                                                    1)) *
                                                (chartRight -
                                                    chartLeft)
                                        );
                                    };

                                    const getY = (
                                        value: number,
                                    ) =>
                                        chartBottom -
                                        ((value - minValue) /
                                            range) *
                                            (chartBottom -
                                                chartTop);

                                    const points = evolution
                                        .map(
                                            (
                                                item,
                                                index,
                                            ) =>
                                                `${getX(
                                                    index,
                                                )},${getY(
                                                    item.total,
                                                )}`,
                                        )
                                        .join(' ');

                                    return (
                                        <>
                                            {[0, 1, 2, 3, 4].map(
                                                (line) => {
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
                                                                className="chart-grid-line"
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
                                                                className="chart-axis-label"
                                                            >
                                                                {formatCurrency(
                                                                    value,
                                                                )}
                                                            </text>
                                                        </g>
                                                    );
                                                },
                                            )}

                                            {evolution.map(
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
                                                                className="chart-grid-line"
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
                                                                className="chart-axis-label"
                                                            >
                                                                {formatReferencePeriod(
                                                                    item
                                                                        .report
                                                                        .reference_period,
                                                                )}
                                                            </text>
                                                        </g>
                                                    );
                                                },
                                            )}

                                            {evolution.length >
                                                1 && (
                                                <polyline
                                                    points={
                                                        points
                                                    }
                                                    className="chart-line"
                                                />
                                            )}

                                            {evolution.map(
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
                                                            item.total,
                                                        )}
                                                        r="4"
                                                        className="chart-point"
                                                    />
                                                ),
                                            )}
                                        </>
                                    );
                                })()}
                            </svg>
                        </div>
                    </section>

                    <section className="evolution-detail">
                        <div className="evolution-section-header">
                            <h2>Histórico detalhado</h2>

                            <p>
                                Consulte os valores registrados e
                                sua diferença em relação ao
                                relatório anterior.
                            </p>
                        </div>

                        <div className="evolution-table-wrapper">
                            <table className="evolution-table">
                                <thead>
                                    <tr>
                                        <th>Período</th>
                                        <th>Valor total CURVA</th>
                                        <th>Diferença</th>
                                        <th>Variação</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {evolution.map((item) => (
                                        <tr
                                            key={
                                                item.report.id
                                            }
                                        >
                                            <td>
                                                {formatReferencePeriodTitle(
                                                    item.report
                                                        .reference_period,
                                                )}
                                            </td>

                                            <td>
                                                {formatCurrency(
                                                    item.total,
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <p className="evolution-footer">
                        * Os valores apresentados representam o
                        patrimônio registrado nos relatórios
                        importados. As variações podem ser
                        influenciadas por novas aplicações,
                        resgates, vencimentos e alterações no
                        valor dos investimentos.
                    </p>
                </>
            )}
        </main>
    );
}

export default Evolution;