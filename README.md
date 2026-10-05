# 📊 MeuInvest

O **MeuInvest** é uma aplicação web desenvolvida para facilitar o acompanhamento de investimentos de **renda fixa** a partir dos relatórios mensais disponibilizados pela **B3**.

A aplicação permite importar os relatórios em formato `.xlsx`, organizar os investimentos e acompanhar sua evolução ao longo do tempo por meio de diferentes análises.

O projeto também representa uma etapa importante do meu aprendizado em desenvolvimento **Full Stack**, tendo passado por diferentes versões e arquiteturas até chegar à implementação atual com **React, TypeScript e Supabase**.

> 🚧 O MeuInvest está atualmente disponível para usuários selecionados.

---

## 🎯 Objetivo

O projeto surgiu com uma ideia simples: facilitar o acompanhamento dos investimentos de renda fixa sem depender da consulta manual de diversos relatórios da B3.

A proposta é transformar os dados presentes nesses relatórios em informações mais fáceis de visualizar e acompanhar, permitindo ao usuário:

- Centralizar seus investimentos;
- Acompanhar seus rendimentos;
- Comparar diferentes períodos;
- Visualizar a evolução do patrimônio;
- Analisar investimentos individualmente.

---

## ✨ Funcionalidades

### 🔐 Autenticação

- Login utilizando Supabase Auth;
- Controle de sessão;
- Rotas protegidas;
- Controle de acesso aos dados por usuário;
- Cadastro público desativado.

### 📥 Importação de relatórios

- Importação de relatórios mensais da B3 em `.xlsx`;
- Validação da estrutura do relatório;
- Identificação automática do período de referência através do nome do arquivo;
- Processamento dos dados de renda fixa;
- Registro das posições no banco de dados.

### 📄 Relatórios

- Visualização dos relatórios importados;
- Consulta dos períodos registrados;
- Exclusão de relatórios;
- Visualização dos investimentos associados a cada importação.

### 📊 Análise mensal

Permite comparar períodos consecutivos e acompanhar:

- Evolução dos valores;
- Variações entre meses;
- Investimentos adicionados;
- Investimentos removidos;
- Alterações nas posições.

### 📈 Evolução

Apresenta a evolução do patrimônio ao longo dos períodos importados, incluindo:

- Patrimônio total;
- Variação acumulada;
- Maior patrimônio registrado;
- Histórico mensal;
- Gráfico de evolução.

### 💰 Análise individual

Permite selecionar um investimento específico e acompanhar:

- Instituição;
- Emissor;
- Código;
- Indexador;
- Data de emissão;
- Vencimento;
- Valor atual;
- Evolução histórica;
- Variação acumulada.

### ⚙️ Configurações

- Alteração de informações do perfil;
- Alteração de senha;
- Seleção do tema da aplicação;
- Opção de exclusão da conta.

---

## 🛠️ Tecnologias

### Frontend

- React
- TypeScript
- Vite
- React Router
- Lucide React

### Backend / BaaS

- Supabase
- Supabase Auth
- PostgreSQL
- Row Level Security (RLS)
- Supabase RPC

### Processamento

- **@stackline/xlsx**
- Processamento de relatórios `.xlsx` da B3

### Deploy

- **Netlify**
- Deploy automático através do GitHub

### Versionamento

- Git
- GitHub

---

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura baseada em React, separando responsabilidades entre páginas, componentes, serviços, contextos, tipos e utilitários.

```text
src/
├── components/
│   └── layout/
│       ├── AppLayout.tsx
│       └── AppLayout.css
│
├── contexts/
│   ├── AuthContext.ts
│   ├── AuthProvider.tsx
│   └── useAuth.ts
│
├── lib/
│   └── supabase.ts
│
├── pages/
│   ├── Home/
│   ├── Login/
│   ├── Register/
│   ├── ForgotPassword/
│   ├── Dashboard/
│   ├── ImportReports/
│   ├── Reports/
│   ├── MonthlyAnalysis/
│   ├── Evolution/
│   ├── InvestmentAnalysis/
│   ├── HowItWorks/
│   └── Settings/
│
├── routes/
│   └── ProtectedRoute.tsx
│
├── services/
│   ├── b3.ts
│   ├── excel.ts
│   └── investments.ts
│
├── types/
│   └── investments.ts
│
├── utils/
│   ├── currency.ts
│   ├── date.ts
│   ├── number.ts
│   └── reference-period.ts
│
├── App.tsx
├── index.css
├── theme.css
└── main.tsx

```

## 📥 Como executar o projeto

### Pré-requisitos

É necessário ter instalado:

- Node.js
- npm
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/SalemiDeveloper/meuinvest-react.git
```

Entre na pasta:

```bash
cd meuinvest-react
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica_do_supabase
```

### 4. Execute o projeto

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:5173
```

---

## 🏗️ Build

Para gerar a versão de produção:

```bash
npm run build
```

Para verificar o projeto localmente após o build:

```bash
npm run preview
```

---

## 🚀 Deploy

O projeto está configurado para deploy através do **Netlify**.

O repositório do GitHub está conectado ao Netlify e a branch `main` é utilizada para os deploys.

O fluxo é:

```text
Alteração no código
       ↓
Git commit
       ↓
git push
       ↓
GitHub
       ↓
Netlify
       ↓
Build
       ↓
Deploy
```

As variáveis de ambiente do Supabase também precisam estar configuradas no ambiente do Netlify.

---

## 🔄 Evolução do projeto

O MeuInvest passou por diferentes versões durante seu desenvolvimento.

A primeira versão foi criada com o objetivo de explorar conceitos de desenvolvimento web e organização de aplicações.

Posteriormente, o projeto foi reestruturado utilizando **Laravel**, explorando conceitos como:

- MVC;
- APIs;
- autenticação;
- PostgreSQL;
- Docker;
- Services;
- integração entre frontend e backend.

A versão atual representa uma nova abordagem utilizando:

- React;
- TypeScript;
- Vite;
- Supabase;
- PostgreSQL;
- RLS;
- Netlify.

Esse processo de reconstrução permitiu comparar diferentes arquiteturas e tecnologias e entender melhor as decisões envolvidas no desenvolvimento de uma aplicação completa.

---

## 📚 Principais aprendizados

Durante o desenvolvimento do MeuInvest, foram explorados diversos conceitos:

- Desenvolvimento de aplicações React;
- TypeScript;
- Componentização;
- React Router;
- Gerenciamento de autenticação;
- Integração com Supabase;
- PostgreSQL;
- Row Level Security;
- RPCs no PostgreSQL;
- Processamento de arquivos Excel;
- Organização de serviços e tipos;
- Proteção de rotas;
- Controle de acesso por usuário;
- Deploy contínuo;
- Git e GitHub;
- Arquitetura e separação de responsabilidades.

---

## 🔮 Próximos passos

O projeto pode continuar evoluindo com novas funcionalidades, como:

- Melhorias nas análises de investimentos;
- Novas visualizações e gráficos;
- Melhorias na experiência de importação;
- Novos indicadores financeiros;
- Melhorias na gestão dos usuários;
- Aprimoramentos de segurança;
- Novos tipos de investimentos.

---

## 👨‍💻 Autor

**Pedro Salemi**

Desenvolvedor Full Stack com foco em desenvolvimento web, PHP, Laravel, React, TypeScript e bancos de dados.

- GitHub: [SalemiDeveloper](https://github.com/SalemiDeveloper)
- LinkedIn: adicione aqui seu perfil

---

## 📄 Licença

Este projeto foi desenvolvido para fins de estudo, aprendizado e construção de portfólio.
