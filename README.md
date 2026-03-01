# 🚗 Oficina Frontend - Sistema de Gerenciamento de Oficina

Sistema SaaS para gestão de oficinas mecânicas, desenvolvido em React com Material-UI.

---

## 🚀 Início Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Configurar backend (criar arquivo .env)
echo REACT_APP_API_URL=http://localhost:8080 > .env

# 3. Iniciar projeto
npm start

# 4. Abrir no navegador
# http://localhost:3000
```

**Pronto!** O projeto estará rodando. 🎉

---

## 📋 Pré-requisitos

Antes de executar o projeto, você precisa ter instalado:

- **Node.js** (versão 14 ou superior)
- **npm** (versão 6 ou superior)

Para verificar se já tem instalado:
```bash
node --version
npm --version
```

💡 **Não tem instalado?** Baixe em: https://nodejs.org/

---

## 📦 Instalação Completa

### Passo 1: Navegar até o diretório do projeto

```bash
cd C:\projetos\oficina-frontend
```

### Passo 2: Instalar dependências

```bash
npm install
```

⏱️ Isso levará alguns minutos. O npm instalará:
- React 19.2.3
- Material-UI 7.3.6
- Axios, React Router, Formik e outras dependências

### Passo 3: Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

**Windows (PowerShell):**
```powershell
echo REACT_APP_API_URL=http://localhost:8080 > .env
```

**Windows (CMD):**
```cmd
echo REACT_APP_API_URL=http://localhost:8080 > .env
```

**Linux/Mac:**
```bash
echo "REACT_APP_API_URL=http://localhost:8080" > .env
```

Ou crie manualmente o arquivo `.env` com o conteúdo:
```env
REACT_APP_API_URL=http://localhost:8080
```

---

## ▶️ Executando o Projeto

### Modo Desenvolvimento

```bash
npm start
```

✅ **O que acontece:**
- Servidor de desenvolvimento inicia
- Browser abre automaticamente em `http://localhost:3000`
- Hot reload habilitado (mudanças aparecem automaticamente)

### Parar o servidor

Pressione `Ctrl + C` no terminal

---

## 🏗️ Build para Produção

### Criar build otimizado

```bash
npm run build
```

Isso cria a pasta `build/` com:
- ✅ Código minificado
- ✅ Assets otimizados
- ✅ Code splitting
- ✅ Pronto para deploy

### Testar o build localmente

```bash
# Instalar servidor estático (uma vez só)
npm install -g serve

# Executar
serve -s build
```

Acesse: `http://localhost:3000`

---

## 🎯 Funcionalidades do Sistema

### ✅ Gerenciamento de Clientes
- Cadastro completo com CEP automático
- Busca e filtros
- Validação de CPF/CNPJ
- Paginação

### ✅ Gerenciamento de Veículos
- Cadastro de veículos
- Vinculação com clientes
- Histórico de serviços

### ✅ Orçamentos
- Criação de orçamentos detalhados
- Cálculo automático de valores
- Controle de status
- Geração de PDF

### ✅ Serviços e Recibos
- Cadastro de serviços
- Emissão de recibos
- Controle de pagamentos

### ✅ Dashboard
- Visão geral do negócio
- Métricas em tempo real
- Cards informativos

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| React | 19.2.3 | Framework principal |
| Material-UI | 7.3.6 | Componentes UI |
| Axios | 1.13.2 | Requisições HTTP |
| React Router | 7.11.0 | Roteamento |
| Formik | 2.4.9 | Formulários |
| Yup | 1.7.1 | Validação |

---

## 📁 Estrutura do Projeto

```
oficina-frontend/
├── public/                 # Arquivos públicos
├── src/
│   ├── components/        # Componentes React
│   │   ├── common/       # Componentes reutilizáveis
│   │   ├── clientes/     # Componentes de clientes
│   │   ├── veiculos/     # Componentes de veículos
│   │   └── orcamentos/   # Componentes de orçamentos
│   ├── pages/            # Páginas principais
│   ├── services/         # Serviços de API
│   ├── contexts/         # Context API
│   ├── utils/            # Utilitários
│   └── constants/        # Constantes
├── .env                  # Variáveis de ambiente
└── package.json          # Dependências
```

---

## ⚙️ Configuração do Backend

O frontend precisa se conectar a uma API backend. Configure a URL no arquivo `.env`:

### Backend Local
```env
REACT_APP_API_URL=http://localhost:8080
```

### Backend em Servidor
```env
REACT_APP_API_URL=https://api.seudominio.com
```

💡 **Importante**: Reinicie o servidor (`npm start`) após alterar o `.env`

---

## 🔐 Autenticação

### Login
O sistema usa autenticação JWT. Para fazer login:

1. Acesse: `http://localhost:3000/login`
2. Credenciais de teste (configuradas no backend):
   - Usuário: `admin`
   - Senha: `admin`

### Token
- Armazenado no `localStorage`
- Enviado automaticamente em todas requisições
- Logout automático se token expirar (401)

---

## 🐛 Problemas Comuns

### Porta 3000 já está em uso

**Solução 1**: Matar o processo
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

**Solução 2**: Usar outra porta
```bash
# Windows
set PORT=3001 && npm start

# Linux/Mac
PORT=3001 npm start
```

### Erro ao instalar dependências

```bash
# Limpar cache e reinstalar
npm cache clean --force
rm -rf node_modules
rm package-lock.json
npm install
```

### Não consegue conectar com backend

Verifique:
1. ✅ Backend está rodando?
2. ✅ URL no `.env` está correta?
3. ✅ CORS configurado no backend?
4. ✅ Firewall não está bloqueando?

### Página em branco após build

```bash
# Verificar se há erros no console
# Pressione F12 no navegador e veja o Console
```

---

## 📝 Scripts Disponíveis

```bash
npm start          # Inicia desenvolvimento
npm run build      # Build de produção
npm test           # Executa testes
npm audit          # Verifica vulnerabilidades
npm outdated       # Lista pacotes desatualizados
```

---

## 📚 Documentação Adicional

- **[CORRECOES_APLICADAS.md](./CORRECOES_APLICADAS.md)** - Correções iniciais aplicadas
- **[IMPLEMENTACOES_COMPLETAS.md](./IMPLEMENTACOES_COMPLETAS.md)** - Todas as implementações detalhadas

---

## 🌐 Deploy

### Opções de Deploy

1. **Netlify** (Recomendado)
   ```bash
   npm run build
   # Arraste a pasta build/ para netlify.com
   ```

2. **Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **GitHub Pages**
   ```bash
   npm install gh-pages
   npm run build
   npm run deploy
   ```

---

## ✅ Checklist de Execução

- [ ] Node.js instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` criado
- [ ] Backend rodando
- [ ] Servidor frontend iniciado (`npm start`)
- [ ] Navegador aberto em `http://localhost:3000`
- [ ] Login realizado com sucesso

---

## 💡 Dicas

### Desenvolvimento
- Use `Ctrl + C` para parar o servidor
- Mudanças no código são aplicadas automaticamente (Hot Reload)
- Abra DevTools com `F12` para debugging

### Performance
- Build de produção é ~10x menor que desenvolvimento
- Use `npm run build` antes de deploy
- Comprima assets para melhor performance

### Debugging
- Erros aparecem no console do browser (F12)
- Erros de compilação aparecem no terminal
- Use React DevTools para inspecionar componentes

---

## 🤝 Suporte

Precisa de ajuda? Consulte:
- Documentação completa nos arquivos `.md` do projeto
- Issues no repositório
- Contato: contato@example.com

---

## 📄 Licença

Este projeto é privado e proprietário.

---

**Desenvolvido com ❤️ usando React e Material-UI**

🚀 **Boa sorte com seu projeto!**
