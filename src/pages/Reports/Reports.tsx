import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

import {
    deleteInvestmentImport,
    getInvestmentImportsWithPositions,
} from '../../services/investments';

import type { InvestmentImportWithPositions } from '../../types/investments';

import { formatDate } from '../../utils/date';

import './Reports.css';

function formatReferencePeriod(value: string): string {
    const date = new Date(`${value}T00:00:00`);

    return date.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
    });
}

function formatImportedDate(value: string): string {
    const date = new Date(value);

    return date.toLocaleDateString('pt-BR');
}

function Reports() {
    const [reports, setReports] = useState<
        InvestmentImportWithPositions[]
    >([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [deletingId, setDeletingId] = useState<number | null>(
        null,
    );

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
                        : 'Não foi possível carregar os relatórios.',
                );
            } finally {
                setLoading(false);
            }
        };

        loadReports();
    }, []);

    const handleDelete = async (
        report: InvestmentImportWithPositions,
    ) => {
        const confirmed = window.confirm(
            `Deseja realmente excluir o relatório de ${formatReferencePeriod(
                report.reference_period,
            )}?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(report.id);
            setError(null);

            await deleteInvestmentImport(report.id);

            setReports((currentReports) =>
                currentReports.filter(
                    (currentReport) =>
                        currentReport.id !== report.id,
                ),
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível excluir o relatório.',
            );
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <main className="reports">
                <p>Carregando relatórios...</p>
            </main>
        );
    }

    return (
        <main className="reports">
            <header className="reports-header">
                <h1>Relatórios</h1>

                <p>
                    Consulte os relatórios mensais importados.
                </p>
            </header>

            {error && (
                <p className="reports-error">
                    {error}
                </p>
            )}

            {reports.length === 0 ? (
                <section className="reports-empty">
                    <p>
                        Nenhum relatório foi importado ainda.
                    </p>
                </section>
            ) : (
                <div className="reports-table-wrapper">
                    <table className="reports-table">
                        <thead>
                            <tr>
                                <th>Período</th>
                                <th>Arquivo</th>
                                <th>Posições</th>
                                <th>Importado em</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reports.map((report) => (
                                <tr key={report.id}>
                                    <td>
                                        {formatReferencePeriod(
                                            report.reference_period,
                                        )}
                                    </td>

                                    <td>
                                        {report.original_filename}
                                    </td>

                                    <td>
                                        {report.positions.length}
                                    </td>

                                    <td>
                                        {formatImportedDate(
                                            report.created_at,
                                        )}
                                    </td>

                                    <td>
                                        <button
                                            type="button"
                                            className="reports-delete-button"
                                            onClick={() =>
                                                handleDelete(
                                                    report,
                                                )
                                            }
                                            disabled={
                                                deletingId ===
                                                report.id
                                            }
                                            title="Excluir relatório"
                                        >
                                            <Trash2
                                                size={14}
                                            />

                                            <span>
                                                {deletingId ===
                                                report.id
                                                    ? 'Excluindo...'
                                                    : 'Excluir'}
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}

export default Reports;