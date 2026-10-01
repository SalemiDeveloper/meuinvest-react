import {
    Download,
    Files,
    FileSpreadsheet,
    FileText,
    Landmark,
    LineChart,
    Upload,
    Globe,
    UserRound,
    LogIn,
    FileUp,
} from 'lucide-react';

import './HowItWorks.css';

type GuideStep = {
    number: string;
    title: string;
    description: string;
    image: string;
    icon: typeof Globe;
};

const guideSteps: GuideStep[] = [
    {
        number: '01',
        title: 'Acesse o site da B3',
        description:
            'O primeiro passo é entrar no site da B3 e procurar pela Área do Investidor.',
        image: '/how-it-works/step-01.png',
        icon: Globe,
    },
    {
        number: '02',
        title: 'Acesse a Área do Investidor',
        description:
            'Segundo passo é acessar a tela para fazer Login na Área do Investidor.',
        image: '/how-it-works/step-02.png',
        icon: UserRound,
    },
    {
        number: '03',
        title: 'Preencha seus dados',
        description:
            'Se for primeiro acesso, clique em "Primeiro acesso" e siga as etapas. Caso não seja, prossiga com o Login.',
        image: '/how-it-works/step-03.png',
        icon: LogIn,
    },
    {
        number: '04',
        title: 'Acessando "Relatórios"',
        description:
            'No menu lateral (PC) ou no Menu (mobile) escolha a opção "Relatórios".',
        image: '/how-it-works/step-04.png',
        icon: FileText,
    },
    {
        number: '05',
        title: 'Exportando corretamente',
        description:
            'Para exportar o relatório de forma correta, selecione "Mensal" e "Arquivo em Excel".',
        image: '/how-it-works/step-05.png',
        icon: FileSpreadsheet,
    },
    {
        number: '06',
        title: 'Importação',
        description:
            'Selecione o mês e ano desejado e clique em "Baixar relatório". É recomendado, para uma boa experiência, exportar os últimos 6 meses.',
        image: '/how-it-works/step-06.png',
        icon: Download,
    },
    {
        number: '07',
        title: 'Etapa 07',
        description:
            'Entre na sua conta no MeuInvest.',
        image: '/how-it-works/step-07.png',
        icon: Landmark,
    },
    {
        number: '08',
        title: 'Etapa 08',
        description:
            'Selecione a opção "Importar relatórios.',
        image: '/how-it-works/step-08.png',
        icon: Upload,
    },
    {
        number: '09',
        title: 'Etapa 09',
        description:
            'Selecione os arquivos que deseja importar. Podendo ser mais de um por vez.',
        image: '/how-it-works/step-09.png',
        icon: Files,
    },
    {
        number: '10',
        title: 'Etapa 10',
        description:
            'Clique em "Importar relatório", espere concluir e após esta etapa pode visualizar as análises dos mesmos.',
        image: '/how-it-works/step-10.png',
        icon: FileUp,
    },
    {
        number: '11',
        title: 'Etapa 11',
        description:
            'Após a importação, os dados ficam disponíveis para consulta e passam a fazer parte do seu histórico de investimentos.',
        image: '/how-it-works/step-11.png',
        icon: LineChart,
    },
];

function HowItWorks() {
    return (
        <main className="how-it-works">
            <header className="how-it-works-header">
                <span className="how-it-works-eyebrow">
                    Guia do MeuInvest
                </span>

                <h1>Como funciona</h1>

                <p>
                    Aprenda passo a passo como baixar seus relatórios
                    da B3 e importá-los no MeuInvest para acompanhar
                    seus investimentos.
                </p>
            </header>

            <div className="how-it-works-layout">
                <aside className="how-it-works-navigation">
                    <h2>Neste guia</h2>

                    <nav>
                        {guideSteps.map(step => (
                            <a
                                key={step.number}
                                href={`#step-${step.number}`}
                            >
                                <span>{step.number}</span>
                                <strong>{step.title}</strong>
                            </a>
                        ))}
                    </nav>
                </aside>

                <div className="how-it-works-content">
                    {guideSteps.map(step => {
                        const Icon = step.icon;

                        return (
                            <section
                                key={step.number}
                                id={`step-${step.number}`}
                                className="how-it-works-step"
                            >
                                <div className="how-it-works-step-heading">
                                    <div className="how-it-works-step-icon">
                                        <Icon size={20} />
                                    </div>

                                    <span>
                                        {step.number}
                                    </span>

                                    <h2>{step.title}</h2>
                                </div>

                                <p className="how-it-works-step-description">
                                    {step.description}
                                </p>

                                <div className="how-it-works-image-wrapper">
                                    <img
                                        src={step.image}
                                        alt={`Passo ${step.number}: ${step.title}`}
                                    />
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}

export default HowItWorks;