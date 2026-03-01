# React Query - Guia de Uso

Guia para usar React Query (TanStack Query) no projeto.

## 📚 O que é React Query?

React Query é uma biblioteca de gerenciamento de estado assíncrono que:
- Gerencia cache de dados da API automaticamente
- Sincroniza dados em background
- Otimiza performance com deduplicação de requests
- Fornece estados de loading/error/success
- Suporta refetch automático

## 🚀 Configuração

O React Query já está configurado no projeto com:

```tsx
// src/lib/react-query.ts
- staleTime: 5 minutos (dados ficam "fresh")
- gcTime: 10 minutos (garbage collection)
- retry: 1 tentativa em caso de erro
- refetchOnWindowFocus: false (não refetch ao focar janela)
```

## 🎯 Query Keys

Query keys organizadas e type-safe:

```tsx
import { queryKeys } from '@/lib/react-query';

// Clientes
queryKeys.clientes.all           // ['clientes']
queryKeys.clientes.lists()       // ['clientes', 'list']
queryKeys.clientes.list(filters) // ['clientes', 'list', { filters }]
queryKeys.clientes.detail(1)     // ['clientes', 'detail', 1]

// Dashboard
queryKeys.dashboard.metrics      // ['dashboard', 'metrics']
```

## 📖 Hooks Disponíveis

### useClientes

```tsx
import { useClientes, useCliente, useCreateCliente } from '@/hooks/queries';

// Listar clientes (com cache)
const { data, isLoading, error } = useClientes(page, size);

// Buscar cliente específico
const { data: cliente } = useCliente(clienteId);

// Criar cliente
const createMutation = useCreateCliente();
createMutation.mutate(novoCliente);
```

### useDashboard

```tsx
import { useDashboardMetrics } from '@/hooks/queries';

// Métricas com refetch automático a cada 30s
const { data: metrics, isLoading } = useDashboardMetrics();
```

## 🔧 Criando Novos Hooks

### Query Hook (GET)

```tsx
// src/hooks/queries/useVeiculos.ts
import { useQuery } from '@tanstack/react-query';
import { veiculoService } from '@/services/veiculoService';
import { queryKeys } from '@/lib/react-query';

export const useVeiculos = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: queryKeys.veiculos.list({ page, size }),
    queryFn: () => veiculoService.getAll(page, size),
    // Opções adicionais
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: true, // Executar query
  });
};
```

### Mutation Hook (POST/PUT/DELETE)

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '@/contexts/NotificationContext';

export const useCreateVeiculo = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: (veiculo) => veiculoService.create(veiculo),
    onSuccess: () => {
      // Invalida cache para refetch
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.veiculos.lists() 
      });
      showNotification('Veículo criado!', 'success');
    },
    onError: () => {
      showNotification('Erro ao criar veículo', 'error');
    },
  });
};
```

## 💡 Uso em Componentes

### Lista com Cache

```tsx
import { useClientes } from '@/hooks/queries';
import { TableSkeleton } from '@/components/common/skeletons';

const ClientesPage = () => {
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = useClientes(page, 10);

  if (isLoading) return <TableSkeleton />;
  if (error) return <div>Erro ao carregar</div>;

  return (
    <div>
      {data.content.map(cliente => (
        <ClienteCard key={cliente.id} {...cliente} />
      ))}
    </div>
  );
};
```

### Mutação com Feedback

```tsx
import { useCreateCliente } from '@/hooks/queries';

const ClienteForm = () => {
  const createMutation = useCreateCliente();

  const handleSubmit = (values) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        navigate('/clientes');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* campos do formulário */}
      <Button 
        type="submit" 
        loading={createMutation.isPending}
      >
        Salvar
      </Button>
    </form>
  );
};
```

## 🔄 Invalidação de Cache

### Invalidar após Mutation

```tsx
// Invalida lista específica
queryClient.invalidateQueries({ 
  queryKey: queryKeys.clientes.list({ page: 0, size: 10 }) 
});

// Invalida todas as listas
queryClient.invalidateQueries({ 
  queryKey: queryKeys.clientes.lists() 
});

// Invalida tudo de clientes
queryClient.invalidateQueries({ 
  queryKey: queryKeys.clientes.all 
});
```

### Atualização Otimista

```tsx
const updateMutation = useMutation({
  mutationFn: updateCliente,
  onMutate: async (newData) => {
    // Cancela refetches em andamento
    await queryClient.cancelQueries({ 
      queryKey: queryKeys.clientes.detail(id) 
    });

    // Snapshot do valor anterior
    const previous = queryClient.getQueryData(
      queryKeys.clientes.detail(id)
    );

    // Atualiza otimisticamente
    queryClient.setQueryData(
      queryKeys.clientes.detail(id), 
      newData
    );

    return { previous };
  },
  onError: (err, newData, context) => {
    // Reverte em caso de erro
    queryClient.setQueryData(
      queryKeys.clientes.detail(id),
      context.previous
    );
  },
  onSettled: () => {
    // Refetch após sucesso ou erro
    queryClient.invalidateQueries({ 
      queryKey: queryKeys.clientes.detail(id) 
    });
  },
});
```

## 🎨 DevTools

React Query DevTools está habilitado em desenvolvimento:

- **Abrir:** Clique no ícone flutuante no canto da tela
- **Visualizar:** Queries ativas, cache, tempos
- **Debug:** Estado de cada query
- **Simular:** Erros e loading states

## ⚡ Performance

### Prefetch

```tsx
const queryClient = useQueryClient();

// Prefetch ao hover
const handleMouseEnter = () => {
  queryClient.prefetchQuery({
    queryKey: queryKeys.clientes.detail(id),
    queryFn: () => clienteService.getById(id),
  });
};
```

### Background Updates

```tsx
// Refetch em background a cada 30 segundos
useQuery({
  queryKey: queryKeys.dashboard.metrics,
  queryFn: getDashboardMetrics,
  refetchInterval: 30000,
});
```

### Deduplicação

React Query automaticamente deduplica requests:
- Múltiplos componentes usando mesma query = 1 request
- Requests simultâneos = aguarda o primeiro

## 🔍 Estados

```tsx
const { 
  data,           // Dados da query
  error,          // Erro se houver
  isLoading,      // Primeira carga
  isFetching,     // Fetching (incluindo refetch)
  isError,        // Houve erro
  isSuccess,      // Sucesso
  refetch,        // Função para refetch manual
} = useQuery(...);

// Mutations
const {
  mutate,         // Função para executar
  mutateAsync,    // Versão async
  isPending,      // Executando
  isError,        // Erro
  isSuccess,      // Sucesso
  reset,          // Resetar estado
} = useMutation(...);
```

## 📋 Boas Práticas

1. **Use query keys estruturadas** - Facilita invalidação
2. **Centralize hooks de query** - Um hook por entidade
3. **Invalide corretamente** - Use hierarquia de keys
4. **Use skeleton loaders** - Melhor que spinners
5. **Trate erros** - Sempre mostre feedback
6. **Prefetch quando possível** - Melhora UX
7. **Configure staleTime** - Balance freshness e requests

## 🚫 Evitar

❌ Buscar dados em useEffect com useState
❌ Gerenciar loading/error manualmente
❌ Duplicar lógica de fetch em componentes
❌ Esquecer de invalidar cache após mutations
❌ Query keys sem estrutura

✅ Use React Query para tudo que é assíncrono!

## 📚 Recursos

- [Docs Oficiais](https://tanstack.com/query/latest)
- [Examples](https://tanstack.com/query/latest/docs/examples/react/basic)
- [Best Practices](https://tkdodo.eu/blog/practical-react-query)

---

**React Query = Cache + Performance + Developer Experience** 🚀
