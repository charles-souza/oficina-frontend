# UI Component Library

Biblioteca de componentes reutilizáveis construída sobre Material-UI.

## 📦 Componentes Disponíveis

### Button

Botão customizado com estados de loading e variantes.

```tsx
import { Button } from '@/components/ui';

// Variantes
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outlined">Outlined</Button>
<Button variant="text">Text</Button>
<Button variant="danger">Danger</Button>

// Loading state
<Button loading>Salvando...</Button>

// Full width
<Button fullWidth>Full Width Button</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outlined' | 'text' | 'danger'
- `loading`: boolean
- `fullWidth`: boolean
- Todas as props padrão do MUI Button

---

### Input

Campo de texto com suporte a máscaras e toggle de senha.

```tsx
import { Input } from '@/components/ui';
import { masks } from '@/validations';

// Input básico
<Input label="Nome" placeholder="Digite seu nome" />

// Com máscara
<Input
  label="CPF"
  mask={masks.cpf}
/>

// Senha com toggle
<Input
  type="password"
  label="Senha"
/>

// Com erro
<Input
  label="Email"
  error
  helperText="Email inválido"
/>
```

**Props:**
- `mask`: (value: string) => string
- `variant`: 'outlined' | 'filled' | 'standard'
- Todas as props padrão do MUI TextField
- Toggle automático de senha quando type="password"

---

### Card

Card customizado com header, footer e dividers.

```tsx
import { Card } from '@/components/ui';

// Card simples
<Card>
  Conteúdo do card
</Card>

// Com header e action
<Card
  title="Título do Card"
  subtitle="Subtítulo opcional"
  action={<Button>Ação</Button>}
>
  Conteúdo
</Card>

// Com footer e dividers
<Card
  title="Card Completo"
  footer={<Button>Cancelar</Button>}
  divider
>
  Conteúdo
</Card>

// Sem padding
<Card noPadding>
  <img src="..." alt="..." style={{ width: '100%' }} />
</Card>
```

**Props:**
- `title`: React.ReactNode
- `subtitle`: React.ReactNode
- `action`: React.ReactNode
- `footer`: React.ReactNode
- `noPadding`: boolean
- `divider`: boolean

---

### Badge

Chip/Badge customizado com variantes coloridas.

```tsx
import { Badge } from '@/components/ui';

<Badge label="Novo" variant="success" />
<Badge label="Erro" variant="error" />
<Badge label="Aviso" variant="warning" />
<Badge label="Info" variant="info" />

// Versão outlined
<Badge label="Tag" text />
```

**Props:**
- `variant`: 'success' | 'error' | 'warning' | 'info' | 'default'
- `text`: boolean (para versão outlined)
- `label`: string

---

### StatusBadge

Badge especializado para status com ícones.

```tsx
import { StatusBadge } from '@/components/ui';

<StatusBadge status="success" label="Concluído" />
<StatusBadge status="error" label="Falhou" />
<StatusBadge status="warning" label="Atenção" />
<StatusBadge status="info" label="Em Análise" />
<StatusBadge status="pending" label="Pendente" />

// Sem ícone
<StatusBadge status="success" label="OK" showIcon={false} />
```

**Props:**
- `status`: 'success' | 'error' | 'warning' | 'info' | 'pending'
- `label`: string
- `showIcon`: boolean

**Ícones padrão:**
- success: CheckCircle
- error: Cancel
- warning: Error
- info: Info
- pending: HourglassEmpty

---

### EmptyState

Componente para estados vazios com call-to-action.

```tsx
import { EmptyState } from '@/components/ui';
import { AddCircle } from '@mui/icons-material';

// Estado vazio simples
<EmptyState
  title="Nenhum item encontrado"
  description="Você ainda não tem itens cadastrados"
/>

// Com ação
<EmptyState
  title="Lista vazia"
  description="Comece adicionando seu primeiro item"
  action={{
    label: "Adicionar Item",
    onClick: handleAdd
  }}
/>

// Com ícone customizado
<EmptyState
  icon={<AddCircle sx={{ fontSize: 40 }} />}
  title="Crie seu primeiro projeto"
  action={{
    label: "Novo Projeto",
    onClick: handleCreate
  }}
/>
```

**Props:**
- `icon`: React.ReactNode (opcional, padrão: Inbox)
- `title`: string
- `description`: string (opcional)
- `action`: { label: string, onClick: () => void } (opcional)

---

## 🎨 Theming

Todos os componentes respeitam o tema global da aplicação (light/dark mode).

## 📝 Boas Práticas

1. **Sempre use os componentes da biblioteca UI** ao invés de MUI diretamente quando disponível
2. **Mantenha consistência** usando as mesmas variantes em contextos similares
3. **Adicione feedback visual** com loading states e disabled states
4. **Use EmptyState** em listas vazias ao invés de texto simples
5. **StatusBadge para status** de ordens, orçamentos, etc.

## 🔧 Extensão

Para adicionar novos componentes à biblioteca:

1. Crie o arquivo do componente em `src/components/ui/`
2. Exporte no `index.ts`
3. Adicione documentação neste README
4. Use TypeScript para todas as props
5. Mantenha compatibilidade com tema light/dark

## 📚 Exemplos Completos

### Formulário com componentes UI

```tsx
import { Input, Button, Card } from '@/components/ui';
import { masks } from '@/validations';

const MyForm = () => {
  return (
    <Card title="Cadastro" divider>
      <Stack spacing={2}>
        <Input label="Nome" required />
        <Input label="CPF" mask={masks.cpf} />
        <Input label="Telefone" mask={masks.phone} />
        <Input type="password" label="Senha" />

        <Button variant="primary" fullWidth>
          Cadastrar
        </Button>
      </Stack>
    </Card>
  );
};
```

### Lista com EmptyState

```tsx
import { EmptyState, StatusBadge } from '@/components/ui';

const OrderList = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <EmptyState
        title="Nenhuma ordem encontrada"
        description="Crie sua primeira ordem de serviço"
        action={{
          label: "Nova Ordem",
          onClick: handleNew
        }}
      />
    );
  }

  return orders.map(order => (
    <div key={order.id}>
      {order.numero}
      <StatusBadge
        status={order.status === 'CONCLUIDA' ? 'success' : 'pending'}
        label={order.status}
      />
    </div>
  ));
};
```
