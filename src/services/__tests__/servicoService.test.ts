import { describe, it, expect, vi, beforeEach } from 'vitest';
import { servicoService, ServicoFilters } from '../servicoService';
import api from '../api';
import { Servico } from '@/types';

// Mock do módulo api
vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock do errorHandler
vi.mock('../../utils/errorHandler', () => ({
  withErrorHandling: (fn: () => any) => fn(),
}));

describe('servicoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve buscar todos os serviços sem filtros', async () => {
      const mockServicos: Servico[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          nome: 'Troca de óleo',
          descricao: 'Troca de óleo e filtro',
          precoPadrao: 150.00,
          tempoEstimado: 60,
          categoria: 'Manutenção preventiva',
          ativo: true,
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          nome: 'Alinhamento',
          descricao: 'Alinhamento de rodas',
          precoPadrao: 80.00,
          tempoEstimado: 45,
          categoria: 'Suspensão',
          ativo: true,
        },
      ];

      (api.get as any).mockResolvedValue({ data: mockServicos });

      const result = await servicoService.getAll();

      expect(api.get).toHaveBeenCalledWith('/servicos', { params: undefined });
      expect(result).toEqual(mockServicos);
    });

    it('deve buscar serviços com filtro de ativo', async () => {
      const mockServicos: Servico[] = [];

      (api.get as any).mockResolvedValue({ data: mockServicos });

      const filters: ServicoFilters = { ativo: true };
      await servicoService.getAll(filters);

      expect(api.get).toHaveBeenCalledWith('/servicos', { params: filters });
    });

    it('deve buscar serviços com filtro de categoria', async () => {
      const mockServicos: Servico[] = [];

      (api.get as any).mockResolvedValue({ data: mockServicos });

      const filters: ServicoFilters = { categoria: 'Manutenção preventiva' };
      await servicoService.getAll(filters);

      expect(api.get).toHaveBeenCalledWith('/servicos', { params: filters });
    });

    it('deve buscar serviços com filtro de pesquisa', async () => {
      const mockServicos: Servico[] = [];

      (api.get as any).mockResolvedValue({ data: mockServicos });

      const filters: ServicoFilters = { search: 'óleo' };
      await servicoService.getAll(filters);

      expect(api.get).toHaveBeenCalledWith('/servicos', { params: filters });
    });
  });

  describe('getById', () => {
    it('deve buscar serviço por ID (UUID)', async () => {
      const mockServico: Servico = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        nome: 'Troca de óleo',
        descricao: 'Troca de óleo e filtro',
        precoPadrao: 150.00,
        tempoEstimado: 60,
        categoria: 'Manutenção preventiva',
        ativo: true,
      };

      (api.get as any).mockResolvedValue({ data: mockServico });

      const result = await servicoService.getById('550e8400-e29b-41d4-a716-446655440001');

      expect(api.get).toHaveBeenCalledWith('/servicos/550e8400-e29b-41d4-a716-446655440001');
      expect(result).toEqual(mockServico);
    });
  });

  describe('getCategories', () => {
    it('deve buscar todas as categorias distintas', async () => {
      const mockCategorias: string[] = [
        'Manutenção preventiva',
        'Suspensão',
        'Freios',
        'Motor',
      ];

      (api.get as any).mockResolvedValue({ data: mockCategorias });

      const result = await servicoService.getCategories();

      expect(api.get).toHaveBeenCalledWith('/servicos/categorias');
      expect(result).toEqual(mockCategorias);
    });
  });

  describe('create', () => {
    it('deve criar um novo serviço', async () => {
      const novoServico = {
        nome: 'Balanceamento',
        descricao: 'Balanceamento de rodas',
        precoPadrao: 60.00,
        tempoEstimado: 30,
        categoria: 'Suspensão',
        ativo: true,
      };

      const mockResponse: Servico = {
        ...novoServico,
        id: '550e8400-e29b-41d4-a716-446655440003',
      };

      (api.post as any).mockResolvedValue({ data: mockResponse });

      const result = await servicoService.create(novoServico);

      expect(api.post).toHaveBeenCalledWith('/servicos', novoServico);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('deve atualizar um serviço existente', async () => {
      const updateData = {
        nome: 'Troca de óleo - Completo',
        descricao: 'Troca de óleo, filtro de óleo e filtro de ar',
        precoPadrao: 180.00,
        tempoEstimado: 75,
        categoria: 'Manutenção preventiva',
        ativo: true,
      };

      const mockResponse: Servico = {
        ...updateData,
        id: '550e8400-e29b-41d4-a716-446655440001',
      };

      (api.put as any).mockResolvedValue({ data: mockResponse });

      const result = await servicoService.update('550e8400-e29b-41d4-a716-446655440001', updateData);

      expect(api.put).toHaveBeenCalledWith('/servicos/550e8400-e29b-41d4-a716-446655440001', updateData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('activate', () => {
    it('deve ativar um serviço', async () => {
      (api.patch as any).mockResolvedValue({});

      await servicoService.activate('550e8400-e29b-41d4-a716-446655440001');

      expect(api.patch).toHaveBeenCalledWith('/servicos/550e8400-e29b-41d4-a716-446655440001/ativar');
    });
  });

  describe('deactivate', () => {
    it('deve desativar um serviço', async () => {
      (api.patch as any).mockResolvedValue({});

      await servicoService.deactivate('550e8400-e29b-41d4-a716-446655440001');

      expect(api.patch).toHaveBeenCalledWith('/servicos/550e8400-e29b-41d4-a716-446655440001/desativar');
    });
  });

  describe('delete', () => {
    it('deve deletar um serviço (soft delete)', async () => {
      (api.delete as any).mockResolvedValue({});

      await servicoService.delete('550e8400-e29b-41d4-a716-446655440001');

      expect(api.delete).toHaveBeenCalledWith('/servicos/550e8400-e29b-41d4-a716-446655440001');
    });
  });
});
