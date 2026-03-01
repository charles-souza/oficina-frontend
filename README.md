# 🚗 Oficina Frontend - Sistema de Gerenciamento de Oficina

Sistema SaaS para gestão de oficinas mecânicas, desenvolvido em **React 19** com **Material-UI 7** e **Vite**.

---

## 🚀 Início Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Abrir no navegador
# http://localhost:3000
```

**Pronto!** O projeto estará rodando. 🎉

---

## 📋 Pré-requisitos

- **Node.js** 18 ou superior
- **npm** 9 ou superior

Verificar versões instaladas:
```bash
node --version
npm --version
```

💡 **Download:** https://nodejs.org/

---

## 📦 Instalação

### 1. Clonar e navegar

```bash
cd C:\projetos\oficina-frontend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente (opcional)

Crie um arquivo `.env.local`:

```env
VITE_API_URL=http://localhost:8080/api
```

**Nota:** Se não configurar, a aplicação usa o proxy configurado no Vite para `/api` → `http://localhost:8080/api`

---

## ▶️ Executando o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

✅ **O que acontece:**
- Servidor Vite inicia em ~500ms
- Browser abre automaticamente em `http://localhost:3000`
- Hot Module Replacement (HMR) instantâneo
- Proxy automático para API backend

### Build de Produção

```bash
npm run build
```

Gera pasta `build/` otimizada:
- ✅ Minificado e otimizado
- ✅ Code splitting automático
- ✅ Sourcemaps incluídos
- ✅ Pronto para deploy

### Preview do Build

```bash
npm run preview
```

Testa o build de produção localmente.

### Parar o servidor

Pressione `Ctrl + C` no terminal

---

## 🎯 Funcionalidades

### ✅ Módulos Principais

| Módulo | Funcionalidades |
|--------|----------------|
| **Dashboard** | Visão geral, métricas em tempo real, 5 cards funcionais |
| **Clientes** | CRUD completo, busca por nome, validação CPF/CNPJ, CEP automático |
| **Veículos** | Cadastro, vinculação com clientes, paginação |
| **Orçamentos** | Criação, cálculo automático, múltiplos itens dinâmicos |
| **Recibos** | Emissão, formas de pagamento, histórico |
| **Serviços** | Catálogo, preços, tempo estimado |

### ✅ Sistema

- **Autenticação JWT** com token automático
- **Formulários validados** com Formik + Yup
- **Notificações** em tempo real
- **Design moderno** e responsivo
- **Loading states** em todas operações
- **Error boundaries** para captura de erros

---

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Propósito |
|-----------|--------|-----------|
| **React** | 19.2.4 | Framework UI |
| **Vite** | 6.4.1 | Build tool (10x mais rápido que CRA) |
| **Material-UI** | 7.3.8 | Componentes UI |
| **Axios** | 1.7.9 | Cliente HTTP |
| **React Router** | 7.13.1 | Roteamento |
| **Formik** | 2.4.9 | Gerenciamento de formulários |
| **Yup** | 1.7.1 | Validação de schemas |

---

## 📁 Estrutura do Projeto

```
oficina-frontend/
├── index.html              # HTML raiz (Vite)
├── vite.config.js          # Configuração do Vite
├── public/                 # Assets estáticos
├── src/
│   ├── components/
│   │   ├── common/        # Componentes reutilizáveis
│   │   │   ├── FormContainer.jsx
│   │   │   ├── FormField.jsx
│   │   │   ├── FormActions.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── clientes/      # Módulo clientes
│   │   ├── veiculos/      # Módulo veículos
│   │   ├── orcamentos/    # Módulo orçamentos
│   │   ├── recibos/       # Módulo recibos
│   │   └── servicos/      # Módulo serviços
│   ├── pages/             # Páginas principais
│   ├── services/          # Serviços de API
│   │   └── api.js         # Instância Axios com interceptors
│   ├── contexts/          # React Context
│   ├── utils/             # Utilitários
│   └── constants/         # Constantes
├── .env.example           # Exemplo de variáveis
└── package.json
```

---

## ⚙️ Configuração

### Backend API

O frontend se conecta ao backend via proxy configurado no `vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  }
}
```

**Requisições:**
- Frontend: `POST /api/auth/login`
- Proxy envia para: `POST http://localhost:8080/api/auth/login`

### Variáveis de Ambiente (Vite)

No Vite, use prefixo `VITE_`:

```env
VITE_API_URL=http://localhost:8080/api
```

Acessar no código:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD
```

---

## 🔐 Autenticação

### Credenciais de Teste

```
Email: admin@oficina.com
Senha: admin123
```

### Como Funciona

1. Login envia credenciais para `/api/auth/login`
2. Backend retorna token JWT
3. Token armazenado em `localStorage`
4. Interceptor Axios adiciona `Authorization: Bearer {token}` em todas requisições
5. Erro 401 → logout automático e redirect para `/login`

### Limpar Sessão

No console do navegador (F12):
```javascript
localStorage.clear()
location.reload()
```

---

## 🐛 Problemas Comuns

### Porta 3000 em uso

```bash
# O Vite tenta automaticamente próxima porta disponível (3001, 3002, etc)
# Ou force uma porta específica em vite.config.js
```

### Erro "process is not defined"

✅ **Resolvido!** O projeto foi migrado para Vite e não usa mais `process.env`.

Use `import.meta.env` no lugar:
```javascript
// ❌ Antigo (CRA)
process.env.REACT_APP_API_URL

// ✅ Novo (Vite)
import.meta.env.VITE_API_URL
```

### Backend não responde

Verificar:
1. ✅ Backend rodando em `http://localhost:8080`
2. ✅ CORS configurado no backend
3. ✅ Token válido no localStorage
4. ✅ Proxy do Vite configurado

### Limpar e reinstalar

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Scripts Disponíveis

```bash
npm run dev        # Desenvolvimento (porta 3000)
npm run build      # Build de produção (~7s)
npm run preview    # Preview do build
npm test           # Testes (Vitest)
npm audit          # Vulnerabilidades (5 moderate)
```

---

## 🚀 Performance & Otimizações

### Build de Produção

| Métrica | Valor |
|---------|-------|
| Tempo de build | ~7.5 segundos |
| Bundle size | ~695 KB (minificado) |
| Gzip size | ~215 KB |
| Chunks | Otimizados automaticamente |

### Dev Server

| Métrica | Vite | CRA (antigo) |
|---------|------|--------------|
| Start time | ~540ms | ~20-30s |
| HMR | Instantâneo | ~2-3s |
| Rebuild | Milissegundos | Segundos |

### Vulnerabilidades

- **Antes (CRA)**: 25 high severity
- **Depois (Vite)**: 5 moderate (apenas em ferramentas de dev)
- **Redução**: 80% menos vulnerabilidades

---

## 📚 Documentação Adicional

- **[MIGRATION_TO_VITE.md](./MIGRATION_TO_VITE.md)** - Detalhes da migração
- **[.env.example](./.env.example)** - Exemplo de variáveis de ambiente

---

## 🌐 Deploy

### Netlify (Recomendado)

1. Build: `npm run build`
2. Upload da pasta `build/`
3. Configure variáveis de ambiente no dashboard

### Vercel

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## ✅ Checklist de Setup

- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] Backend rodando na porta 8080
- [ ] Servidor iniciado (`npm run dev`)
- [ ] Login realizado com sucesso
- [ ] Dashboard carregando dados

---

## 💡 Dicas de Desenvolvimento

### Hot Module Replacement

- Mudanças em JS/JSX: Atualização instantânea sem perder estado
- Mudanças em CSS: Injeção instantânea
- Mudanças em config: Requer restart

### Debug

- **Console do Browser**: F12 → Console
- **React DevTools**: Extensão do Chrome/Firefox
- **Network Tab**: F12 → Network para ver requisições
- **Vite Logs**: Terminal onde rodou `npm run dev`

### Performance

1. Use `React.lazy()` para code splitting
2. Otimize imports (importe apenas o necessário do MUI)
3. Use `React.memo()` em componentes pesados
4. Verifique bundle com `npm run build`

---

## 📦 Migração de CRA para Vite

Este projeto foi migrado de **Create React App** para **Vite**.

**Principais mudanças:**
- ✅ `npm start` → `npm run dev`
- ✅ `process.env.REACT_APP_*` → `import.meta.env.VITE_*`
- ✅ `public/index.html` → `index.html` (raiz)
- ✅ Build 10x mais rápido
- ✅ 80% menos vulnerabilidades

Veja detalhes em [MIGRATION_TO_VITE.md](./MIGRATION_TO_VITE.md)

---

## 🤝 Contribuindo

1. Clone o repositório
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Add nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

---

## 📄 Licença

Projeto proprietário - Todos os direitos reservados

---

**Desenvolvido com ⚡ Vite + ⚛️ React + 🎨 Material-UI**

🚀 **Build rápido. Deploy fácil. Performance máxima.**
