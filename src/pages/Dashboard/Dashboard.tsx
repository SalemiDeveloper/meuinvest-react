import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/useAuth';
import { supabase } from '../../lib/supabase';

import { getLatestInvestmentImport } from '../../services/investments';

import type { InvestmentImportWithPositions } from '../../types/investments';

import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';

import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [latestImport, setLatestImport] =
        useState<InvestmentImportWithPositions | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError(null);

                const investmentImport =
                    await getLatestInvestmentImport();

                setLatestImport(investmentImport);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Não foi possível carregar o dashboard.',
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const totalPatrimony = useMemo(() => {
        if (!latestImport) {
            return 0;
        }

        return latestImport.positions.reduce(
            (total, position) =>
                total + Number(position.curve_value),
            0,
        );
    }, [latestImport]);

    const institutionCount = useMemo(() => {
        if (!latestImport) {
            return 0;
        }

        const institutions = new Set(
            latestImport.positions
                .map((position) => position.institution)
                .filter(Boolean),
        );

        return institutions.size;
    }, [latestImport]);

    const handleLogout = async () => {
        await supabase.auth.signOut();

        navigate('/login');
    };

    if (loading) {
        return <p>Carregando dashboard...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const referenceDate =
        latestImport?.reference_period ?? null;

    const referenceLabel = referenceDate
        ? new Date(`${referenceDate}T00:00:00`).toLocaleDateString(
              'pt-BR',
              {
                  month: 'long',
                  year: 'numeric',
              },
          )
        : null;

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Dashboard</h1>

                <p>
                    Acompanhe um resumo dos seus investimentos a
                    partir do último relatório importado.
                </p>
            </header>

            <section className="dashboard-section">
                <div className="dashboard-section-header">
                    <h2>Visão geral</h2>

                    <p>
                        {referenceLabel
                            ? `Dados referentes ao relatório de ${referenceLabel}.`
                            : 'Ainda não existem relatórios importados.'}
                    </p>
                </div>

                <div className="dashboard-cards">
                    <article className="dashboard-card">
                        <span className="dashboard-card-label">
                            Patrimônio atualizado
                        </span>

                        <strong className="dashboard-card-value">
                            {formatCurrency(totalPatrimony)}
                        </strong>
                    </article>

                    <article className="dashboard-card">
                        <span className="dashboard-card-label">
                            Investimentos
                        </span>

                        <strong className="dashboard-card-value">
                            {latestImport?.positions.length ?? 0}
                        </strong>
                    </article>

                    <article className="dashboard-card">
                        <span className="dashboard-card-label">
                            Instituições
                        </span>

                        <strong className="dashboard-card-value">
                            {institutionCount}
                        </strong>
                    </article>

                    <article className="dashboard-card">
                        <span className="dashboard-card-label">
                            Último relatório
                        </span>

                        <strong className="dashboard-card-value">
                            {referenceLabel ?? '-'}
                        </strong>
                    </article>
                </div>
            </section>

            <section className="dashboard-section">
                <div className="dashboard-action">
                    <div className="dashboard-action-content">
                        <h2>
                            Continue acompanhando seus investimentos
                        </h2>

                        <p>
                            Importe um novo relatório mensal ou
                            compare períodos anteriores.
                        </p>
                    </div>

                    <div className="dashboard-action-buttons">
                        <button
                            type="button"
                            className="dashboard-button dashboard-button-primary"
                            onClick={() =>
                                navigate('/importar-relatorio')
                            }
                        >
                            Importar relatório
                        </button>

                        <button
                            type="button"
                            className="dashboard-button"
                            onClick={() =>
                                navigate('/analise-mensal')
                            }
                        >
                            Análise mensal
                        </button>
                    </div>
                </div>
            </section>

            <section className="dashboard-section">
                <div className="dashboard-section-header">
                    <h2>
                        Investimentos do último relatório
                    </h2>

                    <p>
                        {referenceLabel
                            ? `Relatório de ${referenceLabel}`
                            : 'Nenhum relatório disponível'}
                    </p>
                </div>

                {latestImport &&
                latestImport.positions.length > 0 ? (
                    <div className="dashboard-table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Investimento</th>
                                    <th>Instituição</th>
                                    <th>Vencimento</th>
                                    <th>Valor CURVA</th>
                                </tr>
                            </thead>

                            <tbody>
                                {latestImport.positions.map(
                                    (position) => (
                                        <tr key={position.id}>
                                            <td>
                                                <div className="dashboard-investment-name">
                                                    {position.product}
                                                </div>

                                                <div className="dashboard-investment-code">
                                                    Código:{' '}
                                                    {position.code ??
                                                        '-'}
                                                </div>
                                            </td>

                                            <td>
                                                {position.institution ??
                                                    '-'}
                                            </td>

                                            <td>
                                                {formatDate(
                                                    position.maturity_date,
                                                )}
                                            </td>

                                            <td>
                                                {formatCurrency(
                                                    position.curve_value,
                                                )}
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="dashboard-empty">
                        Você ainda não possui investimentos
                        importados.
                    </div>
                )}
            </section>
        </div>
    );
}

export default Dashboard;