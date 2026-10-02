import {
    ArrowRight,
    BarChart3,
    FileSpreadsheet,
    TrendingUp,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import './Home.css';

const features = [
    {
        icon: FileSpreadsheet,
        title: 'Importe',
        description:
            'Importe seus relatórios mensais da B3 para registrar suas posições.',
    },
    {
        icon: BarChart3,
        title: 'Analise',
        description:
            'Consulte seus investimentos e acompanhe seus valores mês a mês.',
    },
    {
        icon: TrendingUp,
        title: 'Acompanhe',
        description:
            'Visualize a evolução do seu patrimônio ao longo do tempo.',
    },
];

function Home() {
    return (
        <main className="home">
            <header className="home-header">
                <Link
                    to="/"
                    className="home-brand"
                    aria-label="MeuInvest"
                >
                    <img
                        src="/logo_ofc.png"
                        alt="MeuInvest"
                        className="home-brand-logo"
                    />

                    <span>MeuInvest</span>
                </Link>

                <nav className="home-header-actions">
                    <Link
                        to="/login"
                        className="home-login-link"
                    >
                        Entrar
                    </Link>

                    <Link
                        to="/register"
                        className="home-register-button"
                    >
                        Criar conta
                    </Link>
                </nav>
            </header>

            <div className="home-container">
                <section className="home-hero">
                    <span className="home-eyebrow">
                        Controle seus investimentos
                    </span>

                    <h1>
                        Seus investimentos 
                        <br />
                        <span>
                            organizados em um só lugar.
                        </span>
                    </h1>

                    <p className="home-description">
                        O MeuInvest permite importar seus relatórios
                        mensais da B3 e acompanhar, de forma simples,
                        a evolução dos seus investimentos de renda
                        fixa.
                    </p>

                    <div className="home-hero-actions">
                        <Link
                            to="/register"
                            className="home-primary-button"
                        >
                            Começar agora
                            <ArrowRight size={16} />
                        </Link>

                        <Link
                            to="/register"
                            className="home-secondary-button"
                        >
                            Criar conta
                        </Link>
                    </div>
                </section>

                <section className="home-how-it-works">
                    <div className="home-section-header">
                        <div>
                            <h2>Como funciona</h2>

                            <p>
                                Um fluxo simples para acompanhar seus
                                investimentos ao longo do tempo.
                            </p>
                        </div>

                        <Link
                            to="/como-funciona"
                            className="home-guide-link"
                        >
                            Ver guia completo
                            <ArrowRight size={15} />
                        </Link>
                    </div>

                    <div className="home-features">
                        {features.map(feature => {
                            const Icon = feature.icon;

                            return (
                                <article
                                    key={feature.title}
                                    className="home-feature"
                                >
                                    <div className="home-feature-icon">
                                        <Icon size={18} />
                                    </div>

                                    <div>
                                        <h3>
                                            {feature.title}
                                        </h3>

                                        <p>
                                            {feature.description}
                                        </p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Home;