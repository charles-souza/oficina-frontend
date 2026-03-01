import { describe, it, expect, vi, beforeEach } from 'vitest';
import { veiculoService } from '../veiculoService';
import api from '../api';
import { Veiculo, PaginatedResponse } from '@/types';

vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../utils/errorHandler', () => ({
  withErrorHandling: (fn: () => any) => fn(),
}));

describe('veiculoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve converter array em resposta paginada', async () => {
      const mockVeiculos: Veiculo[] = [
        {
          id: 1,
          placa: 'ABC-1234',
          marca: 'Fiat',
          modelo: 'Uno',
          ano: 2020,
          cor: 'Branco',
          clienteId: 1,
        },
        {
          id: 2,
          placa: 'XYZ-9876',
          marca: 'VW',
          modelo: 'Gol',
          ano: 2021,
          cor: 'Preto',
          clienteId: 1,
        },
      ];

      (api.get as any).mockResolvedValue({ data: mockVeiculos });

      const result = await veiculoService.getAll(0, 10);

      expect(api.get).toHaveBeenCalledWith('/veiculos', {
        params: { page: 0, size: 10 },
      });
      expect(result).toEqual({
        content: mockVeiculos,
        totalElements: 2,
        totalPages: 1,
        size: 10,
        number: 0,
      });
    });

    it('deve retornar objeto paginado se backend retornar', async () => {
      const mockResponse: PaginatedResponse<Veiculo> = {
        content: [
          {
            id: 1,
            placa: 'ABC-1234',
            marca: 'Fiat',
            modelo: 'Uno',
            ano: 2020,
            cor: 'Branco',
            clienteId: 1,
          },
        ],
        totalElements: 1,
        totalPages: 1,
        size: 10,
        number: 0,
      };

      (api.get as any).mockResolvedValue({ data: mockResponse });

      const result = await veiculoService.getAll(0, 10);

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getById', () => {
    it('deve buscar veículo por ID', async () => {
      const mockVeiculo: Veiculo = {
        id: 1,
        placa: 'ABC-1234',
        marca: 'Fiat',
        modelo: 'Uno',
        ano: 2020,
        cor: 'Branco',
        clienteId: 1,
      };

      (api.get as any).mockResolvedValue({ data: mockVeiculo });

      const result = await veiculoService.getById(1);

      expect(api.get).toHaveBeenCalledWith('/veiculos/1');
      expect(result).toEqual(mockVeiculo);
    });
  });

  describe('create', () => {
    it('deve criar um novo veículo', async () => {
      const novoVeiculo = {
        placa: 'DEF-5678',
        marca: 'Chevrolet',
        modelo: 'Onix',
        ano: 2022,
        cor: 'Prata',
        clienteId: 2,
      };

      const mockResponse: Veiculo = { ...novoVeiculo, id: 3 };

      (api.post as any).mockResolvedValue({ data: mockResponse });

      const result = await veiculoService.create(novoVeiculo);

      expect(api.post).toHaveBeenCalledWith('/veiculos', novoVeiculo);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('deve atualizar um veículo existente', async () => {
      const updateData = { cor: 'Azul' };
      const mockResponse: Veiculo = {
        id: 1,
        placa: 'ABC-1234',
        marca: 'Fiat',
        modelo: 'Uno',
        ano: 2020,
        cor: 'Azul',
        clienteId: 1,
      };

      (api.put as any).mockResolvedValue({ data: mockResponse });

      const result = await veiculoService.update(1, updateData);

      expect(api.put).toHaveBeenCalledWith('/veiculos/1', updateData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('deve deletar um veículo', async () => {
      (api.delete as any).mockResolvedValue({});

      await veiculoService.delete(1);

      expect(api.delete).toHaveBeenCalledWith('/veiculos/1');
    });
  });
});
