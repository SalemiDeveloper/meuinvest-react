import {
    ArrowRight,
    BarChart3,
    CircleDollarSign,
    FileSpreadsheet,
    FileText,
    LineChart,
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

const benefits = [
    {
        icon: CircleDollarSign,
        title: 'Tenha seus investimentos organizados',
        description:
            'Centralize as informações dos seus investimentos de renda fixa em um único lugar.',
    },
    {
        icon: BarChart3,
        title: 'Entenda seus rendimentos',
        description:
            'Compare seus investimentos entre diferentes períodos e acompanhe suas variações.',
    },
    {
        icon: TrendingUp,
        title: 'Acompanhe sua evolução',
        description:
            'Visualize o crescimento do seu patrimônio ao longo do tempo de forma simples.',
    },
];

const analysisFeatures = [
    {
        icon: FileText,
        title: 'Relatórios',
        description:
            'Consulte os relatórios mensais importados e os investimentos registrados.',
    },
    {
        icon: BarChart3,
        title: 'Análise mensal',
        description:
            'Compare seus investimentos entre meses e acompanhe suas variações.',
    },
    {
        icon: LineChart,
        title: 'Evolução',
        description:
            'Visualize a evolução do seu patrimônio ao longo dos períodos registrados.',
    },
    {
        icon: CircleDollarSign,
        title: 'Análise individual',
        description:
            'Acompanhe a evolução e os rendimentos de cada investimento.',
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
                        className="home-register-button"
                    >
                        Entrar
                    </Link>

                    {/* <Link
                        to="/register"
                        className="home-register-button"
                    >
                        Criar conta
                    </Link> */}
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
                        O MeuInvest facilita o acompanhamento dos
                        rendimentos dos seus investimentos de renda
                        fixa. Basta importar seus relatórios mensais
                        da B3 para acompanhar seus investimentos de
                        forma simples e organizada.
                    </p>

                    <div className="home-hero-actions">
                        <Link
                            to="/login"
                            className="home-primary-button"
                        >
                            Começar agora
                            <ArrowRight size={16} />
                        </Link>

                        {/* <Link
                            to="/register"
                            className="home-secondary-button"
                        >
                            Criar conta
                        </Link> */}
                    </div>
                </section>

                <section className="home-benefits">
                    <div className="home-section-header">
                        <div>
                            <h2>
                                Por que usar o MeuInvest?
                            </h2>

                            <p>
                                Mais clareza para acompanhar seus
                                investimentos de renda fixa.
                            </p>
                        </div>
                    </div>

                    <div className="home-benefits-grid">
                        {benefits.map(benefit => {
                            const Icon = benefit.icon;

                            return (
                                <article
                                    key={benefit.title}
                                    className="home-benefit"
                                >
                                    <div className="home-benefit-icon">
                                        <Icon size={19} />
                                    </div>

                                    <h3>
                                        {benefit.title}
                                    </h3>

                                    <p>
                                        {benefit.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className="home-results">
                    <div className="home-section-header">
                        <div>
                            <h2>
                                Acompanhe seus resultados
                            </h2>

                            <p>
                                Transforme seus relatórios mensais
                                em informações úteis para acompanhar
                                sua evolução.
                            </p>
                        </div>
                    </div>

                    <div className="home-results-content">
                        <div className="home-results-cards">
                            <article className="home-result-card">
                                <span>
                                    Patrimônio atual
                                </span>

                                <strong>
                                    R$ 42.850,32
                                </strong>

                                <small>
                                    Exemplo ilustrativo
                                </small>
                            </article>

                            <article className="home-result-card">
                                <span>
                                    Rendimentos acumulados
                                </span>

                                <strong>
                                    R$ 3.284,17
                                </strong>

                                <small>
                                    Exemplo ilustrativo
                                </small>
                            </article>

                            <article className="home-result-card">
                                <span>
                                    Variação acumulada
                                </span>

                                <strong className="positive">
                                    +8,72%
                                </strong>

                                <small>
                                    Exemplo ilustrativo
                                </small>
                            </article>
                        </div>

                        <div className="home-results-chart">
                            <div className="home-results-chart-header">
                                <div>
                                    <span>
                                        Evolução do patrimônio
                                    </span>

                                    <strong>
                                        Últimos meses
                                    </strong>
                                </div>

                                <LineChart size={20} />
                            </div>

                            <div className="home-chart">
                                <div className="home-chart-grid">
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                </div>

                                <svg
                                    viewBox="0 0 700 220"
                                    preserveAspectRatio="none"
                                    aria-hidden="true"
                                >
                                    <polyline
                                        points="
                                            10,190
                                            100,174
                                            190,165
                                            280,143
                                            370,126
                                            460,111
                                            550,83
                                            690,52
                                        "
                                        className="home-chart-line"
                                    />

                                    <circle
                                        cx="10"
                                        cy="190"
                                        r="4"
                                        className="home-chart-point"
                                    />

                                    <circle
                                        cx="100"
                                        cy="174"
                                        r="4"
                                        className="home-chart-point"
                                    />

                                    <circle
                                        cx="190"
                                        cy="165"
                                        r="4"
                                        className="home-chart-point"
                                    />

                                    <circle
                                        cx="280"
                                        cy="143"
                                        r="4"
                                        className="home-chart-point"
                                    />

                                    <circle
                                        cx="370"
                                        cy="126"
                                        r="4"
                                        className="home-chart-point"
                                    />

                                    <circle
                                        cx="460"
                                        cy="111"
                                        r="4"
                                        className="home-chart-point"
                                    />

                                    <circle
                                        cx="550"
                                        cy="83"
                                        r="4"
                                        className="home-chart-point"
                                    />

                                    <circle
                                        cx="690"
                                        cy="52"
                                        r="4"
                                        className="home-chart-point"
                                    />
                                </svg>
                            </div>

                            <p>
                                Exemplo ilustrativo de evolução
                                patrimonial.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="home-analysis">
                    <div className="home-section-header">
                        <div>
                            <h2>
                                Tudo o que você precisa em um só
                                lugar
                            </h2>

                            <p>
                                Diferentes visões para entender
                                melhor seus investimentos.
                            </p>
                        </div>
                    </div>

                    <div className="home-analysis-grid">
                        {analysisFeatures.map(feature => {
                            const Icon = feature.icon;

                            return (
                                <article
                                    key={feature.title}
                                    className="home-analysis-card"
                                >
                                    <div className="home-analysis-icon">
                                        <Icon size={18} />
                                    </div>

                                    <h3>
                                        {feature.title}
                                    </h3>

                                    <p>
                                        {feature.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className="home-how-it-works">
                    <div className="home-section-header">
                        <div>
                            <h2>Como funciona</h2>

                            <p>
                                Um fluxo simples para acompanhar
                                seus investimentos ao longo do
                                tempo.
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

                <section className="home-final-cta">
                    <span>
                        Organize seus investimentos
                    </span>

                    <h2>
                        Tenha uma visão mais clara da
                        <br />
                        evolução do seu patrimônio.
                    </h2>

                    <p>
                        Importe seus relatórios mensais da B3 e
                        acompanhe seus investimentos de renda fixa
                        em um só lugar.
                    </p>

                    <Link
                        to="/login"
                        className="home-primary-button"
                    >
                        Entrar no MeuInvest
                        <ArrowRight size={16} />
                    </Link>

                    <p className="home-contact">
                        Ainda não possui acesso?{' '}
                        <a
                            href="https://www.linkedin.com/in/pedro-salemi-911604269/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Entre em contato comigo pelo LinkedIn.
                        </a>
                    </p>
                </section>
            </div>
        </main>
    );
}

export default Home;