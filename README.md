# Oficina SaaS - Frontend

Sistema de gerenciamento para oficinas mecânicas construído com React, TypeScript e Material-UI.

## 🚀 Tecnologias

- **React 19.2.4** - Biblioteca UI
- **TypeScript 5.9.3** - Tipagem estática
- **Vite 6.0.11** - Build tool e dev server
- **Material-UI 7.3.8** - Componentes UI
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **Formik + Yup** - Formulários e validação
- **Recharts** - Gráficos e visualizações
- **Date-fns** - Manipulação de datas

## 📋 Funcionalidades

### Módulos Principais

- ✅ **Dashboard** - Métricas e gráficos em tempo real
- ✅ **Clientes** - Cadastro completo com busca por CEP
- ✅ **Veículos** - Gerenciamento de veículos dos clientes
- ✅ **Orçamentos** - Criação e gerenciamento de orçamentos
- ✅ **Ordens de Serviço** - Controle completo do fluxo de trabalho
- ✅ **Recibos** - Emissão de recibos de pagamento
- ✅ **Histórico** - Timeline de eventos e alterações
- ✅ **Perfil** - Gerenciamento de perfil do usuário
- ✅ **Configurações** - Personalização do sistema

### Recursos Avançados

- 🎨 **Dark/Light Mode** - Tema personalizável
- 📱 **Responsivo** - Design adaptável para mobile
- ⚡ **Performance** - Code splitting e lazy loading
- 🔒 **Segurança** - Validações e tratamento de erros
- 🎯 **UX** - Skeleton loaders e estados vazios
- 📊 **Visualizações** - Gráficos interativos

## 🛠️ Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Setup

\`\`\`bash
# Clone o repositório
git clone https://github.com/seu-usuario/oficina-frontend.git

# Entre no diretório
cd oficina-frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
\`\`\`

O projeto estará disponível em \`http://localhost:3000\`

## 📁 Estrutura do Projeto

\`\`\`
oficina-frontend/
├── src/
│   ├── components/         # Componentes React
│   │   ├── common/        # Componentes compartilhados
│   │   ├── ui/            # Biblioteca de componentes UI
│   │   └── ...
│   ├── pages/             # Páginas da aplicação
│   ├── services/          # Serviços de API
│   ├── contexts/          # Contextos React
│   ├── hooks/             # Hooks customizados
│   ├── utils/             # Utilitários
│   ├── validations/       # Schemas e validadores
│   └── types/             # TypeScript types
├── public/                # Assets estáticos
└── vite.config.ts         # Configuração do Vite
\`\`\`

## 🔧 Scripts

\`\`\`bash
npm run dev              # Desenvolvimento
npm run build           # Build de produção
npm run preview         # Preview do build
npm run lint            # ESLint
\`\`\`

## 📚 Documentação

- [UI Components](./src/components/ui/README.md)
- [Performance](./PERFORMANCE.md)

## 📝 Licença

Projeto privado e proprietário.
