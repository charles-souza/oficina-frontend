import { describe, it, expect } from 'vitest';
import {
  maskCPF,
  maskCNPJ,
  maskPhone,
  maskCEP,
  maskPlaca,
  maskMoney,
  unmaskMoney,
  maskPercentage,
  unmaskPercentage,
  maskInteger,
  maskDecimal,
  maskYear,
  unmask,
  applyMask,
} from '../masks';

describe('masks', () => {
  describe('maskCPF', () => {
    it('deve formatar CPF corretamente', () => {
      expect(maskCPF('12345678909')).toBe('123.456.789-09');
    });

    it('deve limitar ao tamanho do CPF', () => {
      expect(maskCPF('123456789091234')).toBe('123.456.789-09');
    });

    it('deve remover caracteres não numéricos', () => {
      expect(maskCPF('abc123def456ghi789jkl09')).toBe('123.456.789-09');
    });
  });

  describe('maskCNPJ', () => {
    it('deve formatar CNPJ corretamente', () => {
      expect(maskCNPJ('11222333000181')).toBe('11.222.333/0001-81');
    });

    it('deve limitar ao tamanho do CNPJ', () => {
      expect(maskCNPJ('1122233300018199999')).toBe('11.222.333/0001-81');
    });

    it('deve remover caracteres não numéricos', () => {
      expect(maskCNPJ('abc11def222ghi333jkl0001mno81')).toBe('11.222.333/0001-81');
    });
  });

  describe('maskPhone', () => {
    it('deve formatar telefone fixo (10 dígitos)', () => {
      expect(maskPhone('1133334444')).toBe('(11) 3333-4444');
    });

    it('deve formatar celular (11 dígitos)', () => {
      expect(maskPhone('11987654321')).toBe('(11) 98765-4321');
    });

    it('deve limitar ao tamanho correto', () => {
      expect(maskPhone('119876543219999')).toBe('(11) 98765-4321');
    });
  });

  describe('maskCEP', () => {
    it('deve formatar CEP corretamente', () => {
      expect(maskCEP('01234567')).toBe('01234-567');
    });

    it('deve limitar ao tamanho do CEP', () => {
      expect(maskCEP('012345679999')).toBe('01234-567');
    });
  });

  describe('maskPlaca', () => {
    it('deve formatar placa antiga', () => {
      expect(maskPlaca('ABC1234')).toBe('ABC-1234');
    });

    it('deve converter para maiúsculas', () => {
      expect(maskPlaca('abc1234')).toBe('ABC-1234');
    });

    it('deve limitar ao tamanho correto', () => {
      expect(maskPlaca('ABC12349999')).toBe('ABC-1234');
    });

    it('deve remover caracteres especiais', () => {
      expect(maskPlaca('AB@C#12$34')).toBe('ABC-1234');
    });
  });

  describe('maskMoney', () => {
    it('deve formatar valor monetário', () => {
      expect(maskMoney('10000')).toContain('100,00');
      expect(maskMoney('150')).toContain('1,50');
      expect(maskMoney('99999')).toContain('999,99');
    });

    it('deve retornar vazio se não houver valor', () => {
      expect(maskMoney('')).toBe('');
    });
  });

  describe('unmaskMoney', () => {
    it('deve extrair valor numérico de moeda', () => {
      expect(unmaskMoney('R$ 100,00')).toBe(100);
      expect(unmaskMoney('R$ 1.234,56')).toBe(1234.56);
    });

    it('deve retornar 0 se não houver valor válido', () => {
      expect(unmaskMoney('R$ ')).toBe(0);
      expect(unmaskMoney('')).toBe(0);
    });
  });

  describe('maskPercentage', () => {
    it('deve formatar porcentagem', () => {
      expect(maskPercentage('50')).toBe('50%');
      expect(maskPercentage('100')).toBe('100%');
    });

    it('deve limitar a 100', () => {
      expect(maskPercentage('150')).toBe('100%');
      expect(maskPercentage('999')).toBe('100%');
    });

    it('deve retornar 0% se não houver valor', () => {
      expect(maskPercentage('')).toBe('0%');
    });
  });

  describe('unmaskPercentage', () => {
    it('deve extrair valor numérico de porcentagem', () => {
      expect(unmaskPercentage('50%')).toBe(50);
      expect(unmaskPercentage('100%')).toBe(100);
    });

    it('deve retornar 0 se não houver valor', () => {
      expect(unmaskPercentage('%')).toBe(0);
      expect(unmaskPercentage('')).toBe(0);
    });
  });

  describe('maskInteger', () => {
    it('deve remover caracteres não numéricos', () => {
      expect(maskInteger('abc123def456')).toBe('123456');
      expect(maskInteger('12.34,56')).toBe('123456');
    });
  });

  describe('maskDecimal', () => {
    it('deve formatar número decimal com 2 casas', () => {
      expect(maskDecimal('123,45')).toBe('123,45');
      expect(maskDecimal('123,456')).toBe('123,45');
    });

    it('deve aceitar quantidade customizada de decimais', () => {
      expect(maskDecimal('123,4567', 3)).toBe('123,456');
      expect(maskDecimal('123,4567', 4)).toBe('123,4567');
    });

    it('deve permitir apenas uma vírgula', () => {
      expect(maskDecimal('123,45,67')).toBe('123,4567');
    });
  });

  describe('maskYear', () => {
    it('deve formatar ano com 4 dígitos', () => {
      expect(maskYear('2023')).toBe('2023');
    });

    it('deve limitar a 4 dígitos', () => {
      expect(maskYear('20239999')).toBe('2023');
    });

    it('deve remover caracteres não numéricos', () => {
      expect(maskYear('abc2023def')).toBe('2023');
    });
  });

  describe('unmask', () => {
    it('deve remover todos os caracteres não numéricos', () => {
      expect(unmask('123.456.789-09')).toBe('12345678909');
      expect(unmask('(11) 98765-4321')).toBe('11987654321');
      expect(unmask('R$ 100,00')).toBe('10000');
    });
  });

  describe('applyMask', () => {
    it('deve aplicar máscara de CPF', () => {
      expect(applyMask('12345678909', 'cpf')).toBe('123.456.789-09');
    });

    it('deve aplicar máscara de CNPJ', () => {
      expect(applyMask('11222333000181', 'cnpj')).toBe('11.222.333/0001-81');
    });

    it('deve aplicar máscara de telefone', () => {
      expect(applyMask('11987654321', 'phone')).toBe('(11) 98765-4321');
    });

    it('deve aplicar máscara de CEP', () => {
      expect(applyMask('01234567', 'cep')).toBe('01234-567');
    });

    it('deve aplicar máscara de placa', () => {
      expect(applyMask('ABC1234', 'placa')).toBe('ABC-1234');
    });

    it('deve aplicar máscara de moeda', () => {
      expect(applyMask('10000', 'money')).toContain('100,00');
    });

    it('deve aplicar máscara de porcentagem', () => {
      expect(applyMask('50', 'percentage')).toBe('50%');
    });

    it('deve aplicar máscara de inteiro', () => {
      expect(applyMask('abc123def', 'integer')).toBe('123');
    });

    it('deve aplicar máscara de ano', () => {
      expect(applyMask('2023', 'year')).toBe('2023');
    });
  });
});
