# Guia de Contribuição

Obrigado por considerar contribuir para o Oficina SaaS Frontend!

## 🔀 Fluxo de Trabalho

### 1. Setup do Projeto

```bash
git clone https://github.com/seu-usuario/oficina-frontend.git
cd oficina-frontend
npm install
npm run dev
```

### 2. Criar Branch

```bash
# Nomenclatura: tipo/descricao-curta
git checkout -b feat/nova-funcionalidade
git checkout -b fix/correcao-bug
git checkout -b docs/atualizar-readme
```

### 3. Desenvolvimento

- Escreva código TypeScript
- Siga os padrões de código
- Adicione testes se aplicável
- Mantenha consistência com código existente

### 4. Commit

```bash
# Padrão de mensagem:
# tipo: descrição curta
#
# Descrição detalhada (opcional)

git commit -m "feat: adicionar validação de CPF"
```

**Tipos de commit:**
- `feat` - Nova funcionalidade
- `fix` - Correção de bug
- `docs` - Documentação
- `style` - Formatação (sem mudança de lógica)
- `refactor` - Refatoração
- `test` - Testes
- `chore` - Manutenção

### 5. Pull Request

1. Push sua branch
2. Abra PR no GitHub
3. Descreva as mudanças
4. Aguarde review

## 📏 Padrões de Código

### TypeScript

```tsx
// ✅ BOM
interface UserProps {
  name: string;
  age: number;
}

const User: React.FC<UserProps> = ({ name, age }) => {
  return <div>{name}, {age}</div>;
};

// ❌ RUIM
const User = (props: any) => {
  return <div>{props.name}</div>;
};
```

### Nomenclatura

```tsx
// Componentes: PascalCase
const UserProfile = () => {};

// Funções: camelCase
const handleSubmit = () => {};

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://...';

// Interfaces: PascalCase com 'I' ou sem
interface UserData {}
type UserProps = {};
```

### Imports

```tsx
// Ordem:
// 1. React
// 2. Bibliotecas externas
// 3. Componentes internos
// 4. Utils/Types
// 5. Styles

import React from 'react';
import { Button } from '@mui/material';
import UserCard from '@/components/UserCard';
import { formatDate } from '@/utils/date';
import './styles.css';
```

## 🧪 Testes

```tsx
// Nomeie arquivos de teste: Component.test.tsx
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## 🎨 Estilo

- Use componentes da biblioteca UI quando possível
- Siga o tema (dark/light mode)
- Mantenha responsividade
- Use Skeleton loaders

## 📝 Documentação

- Documente componentes complexos
- Adicione JSDoc em funções utilitárias
- Atualize README se necessário
- Adicione exemplos de uso

```tsx
/**
 * Formata um valor monetário para Real Brasileiro
 * @param value - Valor numérico a ser formatado
 * @returns String formatada (ex: "R$ 1.234,56")
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
```

## ✅ Checklist de PR

- [ ] Código segue os padrões do projeto
- [ ] TypeScript sem erros
- [ ] Testes passando (se aplicável)
- [ ] Documentação atualizada
- [ ] Sem console.logs desnecessários
- [ ] Build de produção sem erros
- [ ] Testado em diferentes navegadores
- [ ] Responsivo (mobile/desktop)

## 🐛 Reportar Bugs

Inclua:
- Descrição clara
- Steps to reproduce
- Comportamento esperado vs atual
- Screenshots/GIFs
- Ambiente (Browser, OS, versão)
- Console logs (se aplicável)

## 💡 Sugerir Funcionalidades

Antes de implementar:
1. Abra uma issue para discussão
2. Aguarde feedback do time
3. Implemente após aprovação

## 🔍 Code Review

Ao revisar PRs, verifique:
- Funcionalidade
- Padrões de código
- Performance
- Segurança
- Acessibilidade
- Documentação

## 📞 Contato

Para dúvidas sobre contribuição, entre em contato através das issues do GitHub.

---

Obrigado por contribuir! 🎉
