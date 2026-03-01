# Arquitetura do Projeto

Documentação da arquitetura e decisões técnicas do Oficina SaaS Frontend.

## 🏗️ Visão Geral

O projeto segue uma arquitetura modular baseada em React com TypeScript, organizada em camadas bem definidas.

## 📐 Camadas da Aplicação

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Pages & UI Components)          │
├─────────────────────────────────────┤
│         Business Logic Layer        │
│    (Hooks & Contexts)               │
├─────────────────────────────────────┤
│         Data Access Layer           │
│    (Services & API)                 │
├─────────────────────────────────────┤
│         Utilities Layer             │
│    (Validations & Utils)            │
└─────────────────────────────────────┘
```

### 1. Presentation Layer

**Responsabilidades:**
- Renderização de UI
- Gerenciamento de estado local
- Interação com usuário

**Componentes:**
- `pages/` - Páginas da aplicação
- `components/` - Componentes React reutilizáveis
- `components/ui/` - Biblioteca de componentes base

### 2. Business Logic Layer

**Responsabilidades:**
- Lógica de negócio
- Estado global
- Side effects

**Componentes:**
- `hooks/` - Hooks customizados
- `contexts/` - Context API para estado global

### 3. Data Access Layer

**Responsabilidades:**
- Comunicação com API
- Transformação de dados
- Cache (futuro)

**Componentes:**
- `services/` - Serviços de API
- `types/` - Definições TypeScript

### 4. Utilities Layer

**Responsabilidades:**
- Funções utilitárias
- Validações
- Formatações

**Componentes:**
- `utils/` - Utilitários gerais
- `validations/` - Schemas e validadores

## 🔄 Fluxo de Dados

```
User Action
    ↓
Component (Event Handler)
    ↓
Hook (Business Logic)
    ↓
Service (API Call)
    ↓
Backend
    ↓
Service (Transform Response)
    ↓
Hook (Update State)
    ↓
Component (Re-render)
```

## 🎯 Padrões de Design

### 1. Container/Presentation Pattern

```tsx
// Container (lógica)
const UserListContainer = () => {
  const [users, setUsers] = useState([]);
  const loadUsers = async () => {
    const data = await userService.getAll();
    setUsers(data);
  };
  return <UserList users={users} onRefresh={loadUsers} />;
};

// Presentation (UI)
const UserList = ({ users, onRefresh }) => {
  return (
    <div>
      {users.map(user => <UserCard key={user.id} {...user} />)}
    </div>
  );
};
```

### 2. Custom Hooks Pattern

```tsx
// Hook reutilizável
const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    const data = await userService.getAll();
    setUsers(data);
    setLoading(false);
  };

  return { users, loading, loadUsers };
};

// Uso
const MyComponent = () => {
  const { users, loading, loadUsers } = useUsers();
  // ...
};
```

### 3. Service Layer Pattern

```tsx
// Service encapsula chamadas de API
export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  create: async (user: User) => {
    const response = await api.post('/users', user);
    return response.data;
  },
};
```

## 🔐 Gerenciamento de Estado

### Estado Local
- useState para estado de componente
- useReducer para estado complexo

### Estado Global
- Context API para tema, autenticação, notificações
- Futuro: React Query para cache de dados

### Estado de Formulário
- Formik para gerenciamento
- Yup para validação

## 🚀 Performance

### Code Splitting
```tsx
// Lazy loading de rotas
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// Uso com Suspense
<Suspense fallback={<LoadingFallback />}>
  <DashboardPage />
</Suspense>
```

### Memoization
```tsx
// useMemo para cálculos caros
const sortedUsers = useMemo(
  () => users.sort((a, b) => a.name.localeCompare(b.name)),
  [users]
);

// useCallback para funções
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);

// React.memo para componentes
const UserCard = memo(({ user }) => {
  return <div>{user.name}</div>;
});
```

### Bundle Optimization
- Manual chunking por funcionalidade
- Tree shaking automático
- CSS code splitting

## 🔒 Segurança

### Validação de Inputs
```tsx
// Client-side validation
const schema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
});
```

### Tratamento de Erros
```tsx
// Error boundary para erros de runtime
<ErrorBoundary>
  <App />
</ErrorBoundary>

// Try-catch para operações assíncronas
try {
  await api.post('/data');
} catch (error) {
  handleError(error);
}
```

### Autenticação
```tsx
// Token JWT no localStorage
const token = localStorage.getItem('token');
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

## 📦 Módulos Principais

### Dashboard
- Métricas em tempo real
- Gráficos interativos
- Cards informativos

### CRUD Modules
Padrão seguido em todos os módulos:
1. **Page** - Container principal
2. **List** - Listagem com paginação
3. **Form** - Formulário de criação/edição
4. **Service** - Comunicação com API

### UI Library
Componentes reutilizáveis:
- Button, Input, Card
- Badge, StatusBadge
- EmptyState, Skeleton

## 🔄 Ciclo de Vida

```
Mount
  ↓
useEffect (mount)
  ↓
Render
  ↓
User Interaction
  ↓
State Update
  ↓
Re-render
  ↓
useEffect (update)
  ↓
Unmount
  ↓
useEffect cleanup
```

## 🧪 Testing Strategy (Futuro)

### Unit Tests
- Funções utilitárias
- Hooks customizados
- Validadores

### Integration Tests
- Services
- Fluxos de usuário

### E2E Tests
- Fluxos críticos
- User journeys

## 📈 Escalabilidade

### Horizontal
- Adicionar novos módulos seguindo padrão existente
- UI library facilita consistência

### Vertical
- React Query para cache
- Virtual scrolling para listas grandes
- Web workers para processamento pesado

## 🔮 Roadmap Técnico

- [ ] React Query para cache de dados
- [ ] Testes unitários e de integração
- [ ] PWA (Service Workers)
- [ ] Micro-frontends (se necessário)
- [ ] WebSockets para real-time
- [ ] Internacionalização (i18n)

## 📚 Decisões Técnicas

### Por que Vite?
- Build extremamente rápido
- Hot Module Replacement instantâneo
- Configuração simples
- Tree shaking nativo

### Por que Material-UI?
- Componentes prontos e acessíveis
- Theming robusto
- Comunidade ativa
- Design system completo

### Por que TypeScript?
- Type safety
- Melhor DX com autocomplete
- Refatoração segura
- Documentação viva

### Por que Context API?
- Nativo do React
- Suficiente para escala atual
- Sem dependências extras
- Fácil migração futura

## 🎓 Aprendizados

1. **Modularização** - Facilita manutenção
2. **TypeScript** - Previne muitos bugs
3. **Code Splitting** - Melhora performance
4. **Validações** - Centralização é chave
5. **Documentação** - Essencial para onboarding

---

**Mantido por:** Time de Desenvolvimento
**Última atualização:** 2024
