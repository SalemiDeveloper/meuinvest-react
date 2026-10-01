import { useEffect, useMemo, useState } from 'react';

import {
    getInvestmentImportsWithPositions,
} from '../../services/investments';

import type {
    InvestmentImportWithPositions,
    InvestmentPosition,
} from '../../types/investments';

import { formatCurrency } from '../../utils/currency';
import './MonthlyAnalysis.css';

type ComparisonPosition = {
    previous: InvestmentPosition;
    current: InvestmentPosition;
    variation: number;
    variationPercentage: number;
};

type ComparisonResult = {
    previousTotal: number;
    currentTotal: number;
    totalVariation: number;
    totalVariationPercentage: number;

    trackedPreviousTotal: number;
    trackedCurrentTotal: number;
    trackedVariation: number;
    trackedVariationPercentage: number;

    maintained: ComparisonPosition[];
    newPositions: InvestmentPosition[];
    missingPositions: InvestmentPosition[];
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

function getMonthDifference(
    previousPeriod: string,
    currentPeriod: string,
): number {
    const previous = new Date(`${previousPeriod}T00:00:00`);
    const current = new Date(`${currentPeriod}T00:00:00`);

    return (
        (current.getFullYear() - previous.getFullYear()) * 12 +
        (current.getMonth() - previous.getMonth())
    );
}

function isConsecutive(
    previousPeriod: string,
    currentPeriod: string,
): boolean {
    return getMonthDifference(previousPeriod, currentPeriod) === 1;
}

function calculatePercentage(
    previousValue: number,
    currentValue: number,
): number {
    if (previousValue === 0) {
        return currentValue === 0 ? 0 : 100;
    }

    return ((currentValue - previousValue) / previousValue) * 100;
}

function compareReports(
    previousReport: InvestmentImportWithPositions,
    currentReport: InvestmentImportWithPositions,
): ComparisonResult {
    const previousTotal = previousReport.positions.reduce(
        (total, position) =>
            total + Number(position.curve_value),
        0,
    );

    const currentTotal = currentReport.positions.reduce(
        (total, position) =>
            total + Number(position.curve_value),
        0,
    );

    const previousByCode = new Map<string, InvestmentPosition>();

    previousReport.positions.forEach((position) => {
        if (position.code) {
            previousByCode.set(position.code, position);
        }
    });

    const currentByCode = new Map<string, InvestmentPosition>();

    currentReport.positions.forEach((position) => {
        if (position.code) {
            currentByCode.set(position.code, position);
        }
    });

    const maintained: ComparisonPosition[] = [];
    const newPositions: InvestmentPosition[] = [];
    const missingPositions: InvestmentPosition[] = [];

    currentByCode.forEach((currentPosition, code) => {
        const previousPosition = previousByCode.get(code);

        if (!previousPosition) {
            newPositions.push(currentPosition);
            return;
        }

        const previousValue = Number(
            previousPosition.curve_value,
        );

        const currentValue = Number(
            currentPosition.curve_value,
        );

        const variation = currentValue - previousValue;

        maintained.push({
            previous: previousPosition,
            current: currentPosition,
            variation,
            variationPercentage: calculatePercentage(
                previousValue,
                currentValue,
            ),
        });
    });

    previousByCode.forEach((previousPosition, code) => {
        if (!currentByCode.has(code)) {
            missingPositions.push(previousPosition);
        }
    });

    const trackedPreviousTotal = maintained.reduce(
        (total, position) =>
            total + Number(position.previous.curve_value),
        0,
    );

    const trackedCurrentTotal = maintained.reduce(
        (total, position) =>
            total + Number(position.current.curve_value),
        0,
    );

    const totalVariation = currentTotal - previousTotal;

    const trackedVariation =
        trackedCurrentTotal - trackedPreviousTotal;

    return {
        previousTotal,
        currentTotal,
        totalVariation,
        totalVariationPercentage: calculatePercentage(
            previousTotal,
            currentTotal,
        ),

        trackedPreviousTotal,
        trackedCurrentTotal,
        trackedVariation,
        trackedVariationPercentage: calculatePercentage(
            trackedPreviousTotal,
            trackedCurrentTotal,
        ),

        maintained,
        newPositions,
        missingPositions,
    };
}

function MonthlyAnalysis() {
    const [reports, setReports] = useState<
        InvestmentImportWithPositions[]
    >([]);

    const [previousReportId, setPreviousReportId] =
        useState<string>('');

    const [currentReportId, setCurrentReportId] =
        useState<string>('');

    const [comparison, setComparison] =
        useState<ComparisonResult | null>(null);

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

                if (data.length >= 2) {
                    const latest = data[0];
                    const previous = data.find((report) =>
                        isConsecutive(
                            report.reference_period,
                            latest.reference_period,
                        ),
                    );

                    if (previous) {
                        setCurrentReportId(
                            String(latest.id),
                        );

                        setPreviousReportId(
                            String(previous.id),
                        );
                    }
                }
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Não foi possível carregar os relatórios.',
                );
            } finally {
                setLoading(false);
            }
        };

        loadReports();
    }, []);

    const currentReport = useMemo(
        () =>
            reports.find(
                (report) =>
                    String(report.id) === currentReportId,
            ) ?? null,
        [reports, currentReportId],
    );

    const previousReport = useMemo(
        () =>
            reports.find(
                (report) =>
                    String(report.id) === previousReportId,
            ) ?? null,
        [reports, previousReportId],
    );

    const previousReportOptions = useMemo(() => {
        if (!currentReport) {
            return [];
        }

        return reports.filter((report) =>
            isConsecutive(
                report.reference_period,
                currentReport.reference_period,
            ),
        );
    }, [reports, currentReport]);

    const handleCurrentReportChange = (
        reportId: string,
    ) => {
        setCurrentReportId(reportId);
        setPreviousReportId('');
        setComparison(null);
        setError(null);

        const selectedReport = reports.find(
            (report) => String(report.id) === reportId,
        );

        if (!selectedReport) {
            return;
        }

        const previous = reports.find((report) =>
            isConsecutive(
                report.reference_period,
                selectedReport.reference_period,
            ),
        );

        if (previous) {
            setPreviousReportId(String(previous.id));
        }
    };

    const handleCompare = () => {
        setError(null);
        setComparison(null);

        if (!previousReport || !currentReport) {
            setError(
                'Selecione os dois relatórios para realizar a comparação.',
            );
            return;
        }

        if (
            !isConsecutive(
                previousReport.reference_period,
                currentReport.reference_period,
            )
        ) {
            setError(
                'Os relatórios selecionados precisam ser de meses consecutivos.',
            );
            return;
        }

        setComparison(
            compareReports(
                previousReport,
                currentReport,
            ),
        );
    };

    if (loading) {
        return (
            <main className="monthly-analysis">
                <p>Carregando análise mensal...</p>
            </main>
        );
    }

    if (error && reports.length === 0) {
        return (
            <main className="monthly-analysis">
                <p className="monthly-analysis-error">
                    {error}
                </p>
            </main>
        );
    }

    return (
        <main className="monthly-analysis">
            <header className="monthly-analysis-header">
                <h1>Análise mensal</h1>

                <p>
                    Compare a evolução dos seus investimentos
                    entre dois relatórios mensais consecutivos.
                </p>
            </header>

            <section className="monthly-analysis-selector">
                <div className="monthly-analysis-select-group">
                    <label htmlFor="previous-report">
                        Relatório anterior
                    </label>

                    <select
                        id="previous-report"
                        value={previousReportId}
                        onChange={(event) =>
                            setPreviousReportId(
                                event.target.value,
                            )
                        }
                        disabled={!currentReport}
                    >
                        <option value="">
                            Selecione um relatório
                        </option>

                        {previousReportOptions.map((report) => (
                            <option
                                key={report.id}
                                value={report.id}
                            >
                                {formatReferencePeriod(
                                    report.reference_period,
                                )}{' '}
                                — {report.positions.length}{' '}
                                posições
                            </option>
                        ))}
                    </select>
                </div>

                <div className="monthly-analysis-select-group">
                    <label htmlFor="current-report">
                        Relatório atual
                    </label>

                    <select
                        id="current-report"
                        value={currentReportId}
                        onChange={(event) =>
                            handleCurrentReportChange(
                                event.target.value,
                            )
                        }
                    >
                        <option value="">
                            Selecione um relatório
                        </option>

                        {reports.map((report) => (
                            <option
                                key={report.id}
                                value={report.id}
                            >
                                {formatReferencePeriod(
                                    report.reference_period,
                                )}{' '}
                                — {report.positions.length}{' '}
                                posições
                            </option>
                        ))}
                    </select>
                </div>

                <div className="monthly-analysis-selector-action">
                    <button
                        type="button"
                        onClick={handleCompare}
                        disabled={
                            !previousReport ||
                            !currentReport
                        }
                    >
                        Comparar relatórios
                    </button>
                </div>
            </section>

            {error && (
                <p className="monthly-analysis-error">
                    {error}
                </p>
            )}

            {comparison &&
                previousReport &&
                currentReport && (
                    <>
                        <section className="monthly-analysis-section">
                            <div className="monthly-analysis-section-header">
                                <h2>Resumo patrimonial</h2>
                            </div>

                            <div className="monthly-analysis-cards">
                                <article className="monthly-analysis-card">
                                    <span>
                                        Período anterior
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            comparison.previousTotal,
                                        )}
                                    </strong>
                                </article>

                                <article className="monthly-analysis-card">
                                    <span>
                                        Período atual
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            comparison.currentTotal,
                                        )}
                                    </strong>
                                </article>

                                <article className="monthly-analysis-card">
                                    <span>Variação</span>

                                    <strong className="positive">
                                        {comparison.totalVariation >=
                                        0
                                            ? '+'
                                            : ''}
                                        {formatCurrency(
                                            comparison.totalVariation,
                                        )}
                                    </strong>
                                </article>

                                <article className="monthly-analysis-card">
                                    <span>
                                        Variação percentual
                                    </span>

                                    <strong className="positive">
                                        {comparison.totalVariation >=
                                        0
                                            ? '+'
                                            : ''}
                                        {formatPercentage(
                                            comparison.totalVariationPercentage,
                                        )}
                                    </strong>
                                </article>
                            </div>
                        </section>

                        <section className="monthly-analysis-section">
                            <div className="monthly-analysis-section-header">
                                <h2>
                                    Investimentos acompanhados
                                </h2>

                                <p>
                                    Considera apenas os
                                    investimentos identificados
                                    nos dois relatórios,
                                    desconsiderando novas
                                    posições e posições
                                    ausentes.
                                </p>
                            </div>

                            <div className="monthly-analysis-cards">
                                <article className="monthly-analysis-card">
                                    <span>
                                        Acompanhados no período
                                        anterior
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            comparison.trackedPreviousTotal,
                                        )}
                                    </strong>
                                </article>

                                <article className="monthly-analysis-card">
                                    <span>
                                        Acompanhados no período
                                        atual
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            comparison.trackedCurrentTotal,
                                        )}
                                    </strong>
                                </article>

                                <article className="monthly-analysis-card">
                                    <span>Variação</span>

                                    <strong className="positive">
                                        {comparison.trackedVariation >=
                                        0
                                            ? '+'
                                            : ''}
                                        {formatCurrency(
                                            comparison.trackedVariation,
                                        )}
                                    </strong>
                                </article>

                                <article className="monthly-analysis-card">
                                    <span>
                                        Variação percentual
                                        acompanhada
                                    </span>

                                    <strong className="positive">
                                        {comparison.trackedVariation >=
                                        0
                                            ? '+'
                                            : ''}
                                        {formatPercentage(
                                            comparison.trackedVariationPercentage,
                                        )}
                                    </strong>
                                </article>
                            </div>
                        </section>

                        <section className="monthly-analysis-section">
                            <div className="monthly-analysis-section-header">
                                <h2>Posições mantidas</h2>

                                <p>
                                    Investimentos identificados
                                    nos dois relatórios pelo
                                    código do produto.
                                </p>
                            </div>

                            <div className="monthly-analysis-table-wrapper">
                                <table className="monthly-analysis-table">
                                    <thead>
                                        <tr>
                                            <th>Produto</th>
                                            <th>Código</th>
                                            <th>Instituição</th>
                                            <th>Anterior</th>
                                            <th>Atual</th>
                                            <th>Variação</th>
                                            <th>%</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {comparison.maintained.map(
                                            (position) => (
                                                <tr
                                                    key={
                                                        position.current
                                                            .id
                                                    }
                                                >
                                                    <td>
                                                        {
                                                            position
                                                                .current
                                                                .product
                                                        }
                                                    </td>

                                                    <td>
                                                        {position
                                                            .current
                                                            .code ??
                                                            '-'}
                                                    </td>

                                                    <td>
                                                        {position
                                                            .current
                                                            .institution ??
                                                            '-'}
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            position
                                                                .previous
                                                                .curve_value,
                                                        )}
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            position
                                                                .current
                                                                .curve_value,
                                                        )}
                                                    </td>

                                                    <td className="positive">
                                                        {position.variation >=
                                                        0
                                                            ? '+'
                                                            : ''}
                                                        {formatCurrency(
                                                            position.variation,
                                                        )}
                                                    </td>

                                                    <td className="positive">
                                                        {position
                                                            .variationPercentage >=
                                                        0
                                                            ? '+'
                                                            : ''}
                                                        {formatPercentage(
                                                            position.variationPercentage,
                                                        )}
                                                    </td>
                                                </tr>
                                            ),
                                        )}

                                        {comparison.maintained
                                            .length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={7}
                                                    className="monthly-analysis-empty"
                                                >
                                                    Nenhuma posição
                                                    mantida foi
                                                    identificada.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <div className="monthly-analysis-bottom-grid">
                            <section className="monthly-analysis-section">
                                <div className="monthly-analysis-section-header">
                                    <h2>Novas posições</h2>

                                    <p>
                                        Investimentos presentes
                                        apenas no relatório
                                        atual.
                                    </p>
                                </div>

                                <div className="monthly-analysis-table-wrapper">
                                    <table className="monthly-analysis-table">
                                        <thead>
                                            <tr>
                                                <th>Produto</th>
                                                <th>Código</th>
                                                <th>Instituição</th>
                                                <th>Valor</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {comparison.newPositions.map(
                                                (position) => (
                                                    <tr
                                                        key={
                                                            position.id
                                                        }
                                                    >
                                                        <td>
                                                            {
                                                                position.product
                                                            }
                                                        </td>

                                                        <td>
                                                            {position.code ??
                                                                '-'}
                                                        </td>

                                                        <td>
                                                            {position.institution ??
                                                                '-'}
                                                        </td>

                                                        <td>
                                                            {formatCurrency(
                                                                position.curve_value,
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}

                                            {comparison
                                                .newPositions
                                                .length ===
                                                0 && (
                                                <tr>
                                                    <td
                                                        colSpan={
                                                            4
                                                        }
                                                        className="monthly-analysis-empty"
                                                    >
                                                        Nenhuma
                                                        nova
                                                        posição
                                                        identificada.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section className="monthly-analysis-section">
                                <div className="monthly-analysis-section-header">
                                    <h2>
                                        Posições ausentes
                                    </h2>

                                    <p>
                                        Investimentos presentes
                                        no relatório anterior,
                                        mas não no atual.
                                    </p>
                                </div>

                                <div className="monthly-analysis-table-wrapper">
                                    <table className="monthly-analysis-table">
                                        <thead>
                                            <tr>
                                                <th>Produto</th>
                                                <th>Código</th>
                                                <th>Instituição</th>
                                                <th>Valor</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {comparison.missingPositions.map(
                                                (position) => (
                                                    <tr
                                                        key={
                                                            position.id
                                                        }
                                                    >
                                                        <td>
                                                            {
                                                                position.product
                                                            }
                                                        </td>

                                                        <td>
                                                            {position.code ??
                                                                '-'}
                                                        </td>

                                                        <td>
                                                            {position.institution ??
                                                                '-'}
                                                        </td>

                                                        <td>
                                                            {formatCurrency(
                                                                position.curve_value,
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}

                                            {comparison
                                                .missingPositions
                                                .length ===
                                                0 && (
                                                <tr>
                                                    <td
                                                        colSpan={
                                                            4
                                                        }
                                                        className="monthly-analysis-empty"
                                                    >
                                                        Nenhuma
                                                        posição
                                                        ausente
                                                        identificada.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                    </>
                )}
        </main>
    );
}

export default MonthlyAnalysis;