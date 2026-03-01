# Testing - Guia de Testes

Guia completo para testes no projeto Oficina Frontend.

## 📚 Stack de Testes

- **Vitest** - Framework de testes rápido e moderno
- **Testing Library** - Testes focados no comportamento do usuário
- **jsdom** - Ambiente DOM para testes
- **User Event** - Simulação de interações do usuário

## 🚀 Executando Testes

```bash
# Modo watch (reexecuta ao salvar)
npm test

# Executar uma vez
npm run test:run

# Com interface visual
npm run test:ui

# Com cobertura
npm run test:coverage
```

## 📁 Estrutura de Testes

```
src/
├── services/
│   ├── clienteService.ts
│   └── __tests__/
│       └── clienteService.test.ts
├── components/
│   └── ui/
│       ├── Button.tsx
│       └── __tests__/
│           └── Button.test.tsx
└── validations/
    ├── validators.ts
    └── __tests__/
        └── validators.test.ts
```

## 🎯 Convenções

### Nomenclatura

- Arquivos de teste: `*.test.ts` ou `*.test.tsx`
- Diretório: `__tests__/` no mesmo nível do código
- Nomes descritivos: `deve criar um cliente`, `deve validar CPF`

### Estrutura de Teste

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('NomeDoComponente', () => {
  beforeEach(() => {
    // Setup antes de cada teste
  });

  it('deve fazer algo específico', () => {
    // Arrange (preparar)
    const props = { value: 'test' };

    // Act (agir)
    render(<Component {...props} />);

    // Assert (verificar)
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
```

## 🧪 Tipos de Testes

### 1. Testes de Services

Testam lógica de negócio e chamadas de API.

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clienteService } from '../clienteService';
import api from '../api';

vi.mock('../api');

describe('clienteService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve buscar todos os clientes', async () => {
    const mockData = { content: [], totalElements: 0 };
    (api.get as any).mockResolvedValue({ data: mockData });

    const result = await clienteService.getAll(0, 10);

    expect(api.get).toHaveBeenCalledWith('/clientes', {
      params: { page: 0, size: 10 },
    });
    expect(result).toEqual(mockData);
  });
});
```

### 2. Testes de Componentes

Testam renderização e interação com UI.

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button', () => {
  it('deve chamar onClick quando clicado', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Clique</Button>);
    const button = screen.getByRole('button');

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('deve mostrar loading', () => {
    render(<Button loading>Carregando</Button>);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
```

### 3. Testes de Validação

Testam funções puras de validação.

```tsx
import { isValidCPF, maskCPF } from '../validators';

describe('validators', () => {
  describe('isValidCPF', () => {
    it('deve validar CPF correto', () => {
      expect(isValidCPF('123.456.789-09')).toBe(true);
    });

    it('deve rejeitar CPF inválido', () => {
      expect(isValidCPF('111.111.111-11')).toBe(false);
    });
  });
});
```

## 🎨 Queries Testing Library

### Ordem de Preferência

1. **getByRole** - Mais acessível (preferido)
2. **getByLabelText** - Formulários
3. **getByPlaceholderText** - Inputs
4. **getByText** - Conteúdo visível
5. **getByTestId** - Último recurso

### Tipos de Queries

```tsx
// getBy* - Retorna elemento ou erro
const button = screen.getByRole('button');

// queryBy* - Retorna elemento ou null
const button = screen.queryByRole('button');

// findBy* - Retorna Promise (para async)
const button = await screen.findByRole('button');

// getAllBy* - Retorna array ou erro
const buttons = screen.getAllByRole('button');
```

## 🔧 Mocks

### Mocking de Módulos

```tsx
// Mock completo do módulo
vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock parcial
vi.mock('../utils', async () => {
  const actual = await vi.importActual('../utils');
  return {
    ...actual,
    someFunction: vi.fn(),
  };
});
```

### Mocking de Funções

```tsx
const mockFn = vi.fn();
mockFn.mockReturnValue('valor');
mockFn.mockResolvedValue('async valor');
mockFn.mockImplementation(() => 'custom');

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg');
expect(mockFn).toHaveBeenCalledTimes(2);
```

## 📊 Cobertura de Código

```bash
npm run test:coverage
```

Metas de cobertura:
- **Statements**: ≥ 80%
- **Branches**: ≥ 75%
- **Functions**: ≥ 80%
- **Lines**: ≥ 80%

Arquivos excluídos da cobertura:
- `*.d.ts` - Tipos TypeScript
- `*.config.*` - Arquivos de configuração
- `setupTests.ts` - Setup de testes
- `mockData/` - Dados de teste

## 🎯 Boas Práticas

### ✅ DO

- Teste comportamento, não implementação
- Use queries acessíveis (getByRole)
- Faça testes independentes
- Teste casos de erro
- Use nomes descritivos
- Limpe mocks entre testes

```tsx
it('deve mostrar erro quando API falha', async () => {
  (api.get as any).mockRejectedValue(new Error('API Error'));

  render(<Component />);

  expect(await screen.findByText('Erro ao carregar')).toBeInTheDocument();
});
```

### ❌ DON'T

- Não teste detalhes de implementação
- Não use snapshots em excesso
- Não teste bibliotecas de terceiros
- Não compartilhe estado entre testes
- Não ignore testes quebrados

```tsx
// ❌ Ruim - testa implementação
expect(component.state.isLoading).toBe(true);

// ✅ Bom - testa comportamento
expect(screen.getByRole('progressbar')).toBeInTheDocument();
```

## 🔍 Debug de Testes

### Screen Debug

```tsx
import { screen } from '@testing-library/react';

// Mostra todo o HTML
screen.debug();

// Mostra elemento específico
screen.debug(screen.getByRole('button'));

// Limite de caracteres
screen.debug(undefined, 50000);
```

### Logging

```tsx
// Use console.log para debug
it('deve fazer algo', () => {
  const element = screen.getByRole('button');
  console.log('Element:', element.textContent);
});
```

### Testing Library Config

```tsx
import { configure } from '@testing-library/react';

configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 2000,
});
```

## 🚀 CI/CD

### GitHub Actions

```yaml
- name: Run tests
  run: npm run test:run

- name: Coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

### Pre-commit Hook

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:run"
    }
  }
}
```

## 📚 Recursos

- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Best Practices](https://testingjavascript.com/)

## 📈 Status Atual

- **Total de Testes**: 107
- **Taxa de Sucesso**: 100%
- **Tempo de Execução**: ~45s
- **Arquivos Testados**: 6

### Testes Implementados

#### Services (14 testes)
- ✅ clienteService (8 testes)
  - getAll, getById, getByName
  - create, update, delete
  - Filtros e paginação

- ✅ veiculoService (6 testes)
  - getAll com conversão array→paginated
  - getById, create, update, delete

#### Components (24 testes)
- ✅ Button (15 testes)
  - Variants: primary, secondary, outlined, text, danger
  - Estados: loading, disabled
  - Eventos: onClick
  - Props: fullWidth, startIcon

- ✅ StatusBadge (9 testes)
  - Status: success, error, warning, info, pending
  - Props: showIcon

#### Validations (69 testes)
- ✅ Validators (28 testes)
  - CPF, CNPJ (validação completa)
  - Email, telefone, CEP
  - Placa (antiga e Mercosul)
  - Senha forte e strength
  - Money e percentage

- ✅ Masks (41 testes)
  - CPF, CNPJ, telefone, CEP
  - Placa, moeda, porcentagem
  - Integer, decimal, ano
  - applyMask (aplicação automática)

---

**Testing = Confiança + Qualidade + Documentação** 🧪
