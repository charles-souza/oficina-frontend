import { describe, it, expect } from 'vitest';
import {
  isValidCPF,
  isValidCNPJ,
  isValidEmail,
  isValidPhone,
  isValidCEP,
  isValidPlaca,
  isStrongPassword,
  getPasswordStrength,
  isValidMoney,
  isValidPercentage,
} from '../validators';

describe('validators', () => {
  describe('isValidCPF', () => {
    it('deve validar CPF correto', () => {
      expect(isValidCPF('123.456.789-09')).toBe(true);
      expect(isValidCPF('12345678909')).toBe(true);
    });

    it('deve rejeitar CPF inválido', () => {
      expect(isValidCPF('123.456.789-00')).toBe(false);
      expect(isValidCPF('111.111.111-11')).toBe(false);
      expect(isValidCPF('000.000.000-00')).toBe(false);
      expect(isValidCPF('12345678')).toBe(false);
    });

    it('deve rejeitar CPF com todos os dígitos iguais', () => {
      expect(isValidCPF('111.111.111-11')).toBe(false);
      expect(isValidCPF('222.222.222-22')).toBe(false);
    });
  });

  describe('isValidCNPJ', () => {
    it('deve validar CNPJ correto', () => {
      expect(isValidCNPJ('11.222.333/0001-81')).toBe(true);
      expect(isValidCNPJ('11222333000181')).toBe(true);
    });

    it('deve rejeitar CNPJ inválido', () => {
      expect(isValidCNPJ('11.222.333/0001-00')).toBe(false);
      expect(isValidCNPJ('11.111.111/1111-11')).toBe(false);
      expect(isValidCNPJ('00.000.000/0000-00')).toBe(false);
      expect(isValidCNPJ('1122233300')).toBe(false);
    });

    it('deve rejeitar CNPJ com todos os dígitos iguais', () => {
      expect(isValidCNPJ('11.111.111/1111-11')).toBe(false);
      expect(isValidCNPJ('22.222.222/2222-22')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('deve validar e-mail correto', () => {
      expect(isValidEmail('usuario@example.com')).toBe(true);
      expect(isValidEmail('teste.usuario@domain.com.br')).toBe(true);
      expect(isValidEmail('nome+tag@empresa.org')).toBe(true);
    });

    it('deve rejeitar e-mail inválido', () => {
      expect(isValidEmail('email_invalido')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('usuario@')).toBe(false);
      expect(isValidEmail('usuario@.com')).toBe(false);
      expect(isValidEmail('usuario @example.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('deve validar telefone fixo (10 dígitos)', () => {
      expect(isValidPhone('(11) 3333-4444')).toBe(true);
      expect(isValidPhone('1133334444')).toBe(true);
    });

    it('deve validar celular (11 dígitos)', () => {
      expect(isValidPhone('(11) 98765-4321')).toBe(true);
      expect(isValidPhone('11987654321')).toBe(true);
    });

    it('deve rejeitar telefone inválido', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('(11) 3333')).toBe(false);
      expect(isValidPhone('119876543210')).toBe(false);
    });
  });

  describe('isValidCEP', () => {
    it('deve validar CEP correto', () => {
      expect(isValidCEP('01234-567')).toBe(true);
      expect(isValidCEP('01234567')).toBe(true);
    });

    it('deve rejeitar CEP inválido', () => {
      expect(isValidCEP('0123')).toBe(false);
      expect(isValidCEP('012345678')).toBe(false);
    });
  });

  describe('isValidPlaca', () => {
    it('deve validar placa antiga (ABC-1234)', () => {
      expect(isValidPlaca('ABC-1234')).toBe(true);
      expect(isValidPlaca('XYZ-9876')).toBe(true);
    });

    it('deve validar placa Mercosul (ABC1D34)', () => {
      expect(isValidPlaca('ABC1D34')).toBe(true);
      expect(isValidPlaca('XYZ2E56')).toBe(true);
    });

    it('deve rejeitar placa inválida', () => {
      expect(isValidPlaca('ABC-12345')).toBe(false);
      expect(isValidPlaca('AB-1234')).toBe(false);
      expect(isValidPlaca('1234-ABC')).toBe(false);
      expect(isValidPlaca('ABC123')).toBe(false);
    });

    it('deve ser case-insensitive', () => {
      expect(isValidPlaca('abc-1234')).toBe(true);
      expect(isValidPlaca('abc1d34')).toBe(true);
    });
  });

  describe('isStrongPassword', () => {
    it('deve validar senha forte', () => {
      expect(isStrongPassword('Senha123')).toBe(true);
      expect(isStrongPassword('MyP@ssw0rd')).toBe(true);
      expect(isStrongPassword('Abcdefgh1')).toBe(true);
    });

    it('deve rejeitar senha fraca', () => {
      expect(isStrongPassword('senha')).toBe(false);
      expect(isStrongPassword('SENHA123')).toBe(false);
      expect(isStrongPassword('senha123')).toBe(false);
      expect(isStrongPassword('Senha')).toBe(false);
      expect(isStrongPassword('1234567')).toBe(false);
    });
  });

  describe('getPasswordStrength', () => {
    it('deve retornar weak para senha curta', () => {
      expect(getPasswordStrength('12345')).toBe('weak');
      expect(getPasswordStrength('abc')).toBe('weak');
    });

    it('deve retornar medium para senha média', () => {
      expect(getPasswordStrength('1234567')).toBe('medium');
      expect(getPasswordStrength('abcdefg')).toBe('medium');
      expect(getPasswordStrength('abc12345')).toBe('medium');
    });

    it('deve retornar strong para senha forte', () => {
      expect(getPasswordStrength('Senha123!')).toBe('strong');
      expect(getPasswordStrength('MyP@ssw0rd')).toBe('strong');
      expect(getPasswordStrength('Abc123!@#')).toBe('strong');
    });
  });

  describe('isValidMoney', () => {
    it('deve validar valor monetário positivo', () => {
      expect(isValidMoney(100)).toBe(true);
      expect(isValidMoney(0)).toBe(true);
      expect(isValidMoney('50.99')).toBe(true);
      expect(isValidMoney('1000')).toBe(true);
    });

    it('deve rejeitar valor monetário negativo', () => {
      expect(isValidMoney(-10)).toBe(false);
      expect(isValidMoney('-50.99')).toBe(false);
    });

    it('deve rejeitar valor não numérico', () => {
      expect(isValidMoney('abc')).toBe(false);
      expect(isValidMoney('R$ 100')).toBe(false);
    });
  });

  describe('isValidPercentage', () => {
    it('deve validar porcentagem válida (0-100)', () => {
      expect(isValidPercentage(0)).toBe(true);
      expect(isValidPercentage(50)).toBe(true);
      expect(isValidPercentage(100)).toBe(true);
      expect(isValidPercentage(25.5)).toBe(true);
    });

    it('deve rejeitar porcentagem inválida', () => {
      expect(isValidPercentage(-1)).toBe(false);
      expect(isValidPercentage(101)).toBe(false);
      expect(isValidPercentage(150)).toBe(false);
    });

    it('deve rejeitar valor não numérico', () => {
      expect(isValidPercentage(NaN)).toBe(false);
    });
  });
});
