import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clienteService } from '../clienteService';
import api from '../api';
import { Cliente, PaginatedResponse } from '@/types';

// Mock do módulo api
vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock do errorHandler
vi.mock('../../utils/errorHandler', () => ({
  withErrorHandling: (fn: () => any) => fn(),
}));

describe('clienteService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve buscar todos os clientes com paginação', async () => {
      const mockResponse: PaginatedResponse<Cliente> = {
        content: [
          {
            id: 1,
            nome: 'João Silva',
            cpfCnpj: '123.456.789-00',
            telefone: '(11) 98765-4321',
            email: 'joao@email.com',
            endereco: 'Rua A, 123',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '01234-567',
          },
        ],
        totalElements: 1,
        totalPages: 1,
        size: 10,
        number: 0,
      };

      (api.get as any).mockResolvedValue({ data: mockResponse });

      const result = await clienteService.getAll(0, 10);

      expect(api.get).toHaveBeenCalledWith('/clientes', {
        params: { page: 0, size: 10 },
      });
      expect(result).toEqual(mockResponse);
    });

    it('deve buscar clientes com filtros', async () => {
      const mockResponse: PaginatedResponse<Cliente> = {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 10,
        number: 0,
      };

      (api.get as any).mockResolvedValue({ data: mockResponse });

      await clienteService.getAll(0, 10, { nome: 'João' });

      expect(api.get).toHaveBeenCalledWith('/clientes', {
        params: { page: 0, size: 10, nome: 'João' },
      });
    });
  });

  describe('getById', () => {
    it('deve buscar cliente por ID', async () => {
      const mockCliente: Cliente = {
        id: 1,
        nome: 'João Silva',
        cpfCnpj: '123.456.789-00',
        telefone: '(11) 98765-4321',
        email: 'joao@email.com',
        endereco: 'Rua A, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
      };

      (api.get as any).mockResolvedValue({ data: mockCliente });

      const result = await clienteService.getById(1);

      expect(api.get).toHaveBeenCalledWith('/clientes/1');
      expect(result).toEqual(mockCliente);
    });
  });

  describe('getByName', () => {
    it('deve buscar clientes por nome', async () => {
      const mockClientes: Cliente[] = [
        {
          id: 1,
          nome: 'João Silva',
          cpfCnpj: '123.456.789-00',
          telefone: '(11) 98765-4321',
          email: 'joao@email.com',
          endereco: 'Rua A, 123',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567',
        },
      ];

      (api.get as any).mockResolvedValue({ data: mockClientes });

      const result = await clienteService.getByName('João');

      expect(api.get).toHaveBeenCalledWith('/clientes/nome/Jo%C3%A3o');
      expect(result).toEqual(mockClientes);
    });

    it('deve fazer encoding do nome corretamente', async () => {
      (api.get as any).mockResolvedValue({ data: [] });

      await clienteService.getByName('José & Maria');

      expect(api.get).toHaveBeenCalledWith(
        '/clientes/nome/Jos%C3%A9%20%26%20Maria'
      );
    });
  });

  describe('create', () => {
    it('deve criar um novo cliente', async () => {
      const novoCliente = {
        nome: 'Maria Santos',
        cpfCnpj: '987.654.321-00',
        telefone: '(11) 91234-5678',
        email: 'maria@email.com',
        endereco: 'Rua B, 456',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '04321-098',
      };

      const mockResponse: Cliente = { ...novoCliente, id: 2 };

      (api.post as any).mockResolvedValue({ data: mockResponse });

      const result = await clienteService.create(novoCliente);

      expect(api.post).toHaveBeenCalledWith('/clientes', novoCliente);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('deve atualizar um cliente existente', async () => {
      const updateData = { telefone: '(11) 99999-9999' };
      const mockResponse: Cliente = {
        id: 1,
        nome: 'João Silva',
        cpfCnpj: '123.456.789-00',
        telefone: '(11) 99999-9999',
        email: 'joao@email.com',
        endereco: 'Rua A, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
      };

      (api.put as any).mockResolvedValue({ data: mockResponse });

      const result = await clienteService.update(1, updateData);

      expect(api.put).toHaveBeenCalledWith('/clientes/1', updateData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('deve deletar um cliente', async () => {
      (api.delete as any).mockResolvedValue({});

      await clienteService.delete(1);

      expect(api.delete).toHaveBeenCalledWith('/clientes/1');
    });
  });
});
