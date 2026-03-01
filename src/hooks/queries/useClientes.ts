import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clienteService } from '@/services/clienteService';
import { queryKeys } from '@/lib/react-query';
import { Cliente } from '@/types';
import { useNotification } from '@/contexts/NotificationContext';

/**
 * Hook para listar clientes com cache
 */
export const useClientes = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: queryKeys.clientes.list({ page, size }),
    queryFn: () => clienteService.getAll(page, size),
  });
};

/**
 * Hook para buscar cliente por ID
 */
export const useCliente = (id: number) => {
  return useQuery({
    queryKey: queryKeys.clientes.detail(id),
    queryFn: () => clienteService.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook para buscar clientes por nome
 */
export const useClientesByName = (nome: string) => {
  return useQuery({
    queryKey: [...queryKeys.clientes.lists(), { nome }],
    queryFn: () => clienteService.getByName(nome),
    enabled: nome.length >= 3,
  });
};

/**
 * Hook para criar cliente
 */
export const useCreateCliente = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: (cliente: Omit<Cliente, 'id'>) => clienteService.create(cliente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clientes.lists() });
      showNotification('Cliente criado com sucesso!', 'success');
    },
    onError: () => {
      showNotification('Erro ao criar cliente', 'error');
    },
  });
};

/**
 * Hook para atualizar cliente
 */
export const useUpdateCliente = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Cliente> }) =>
      clienteService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clientes.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.clientes.detail(variables.id) });
      showNotification('Cliente atualizado com sucesso!', 'success');
    },
    onError: () => {
      showNotification('Erro ao atualizar cliente', 'error');
    },
  });
};

/**
 * Hook para deletar cliente
 */
export const useDeleteCliente = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: (id: number) => clienteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clientes.lists() });
      showNotification('Cliente excluído com sucesso!', 'success');
    },
    onError: () => {
      showNotification('Erro ao excluir cliente', 'error');
    },
  });
};
