/**
 * Máscaras para formatação de inputs
 */

// ============================================================================
// MÁSCARA DE CPF
// ============================================================================

export const maskCPF = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

// ============================================================================
// MÁSCARA DE CNPJ
// ============================================================================

export const maskCNPJ = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

// ============================================================================
// MÁSCARA DE TELEFONE
// ============================================================================

export const maskPhone = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');

  if (cleanValue.length <= 10) {
    // Telefone fixo: (11) 1234-5678
    return cleanValue
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  } else {
    // Celular: (11) 91234-5678
    return cleanValue
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  }
};

// ============================================================================
// MÁSCARA DE CEP
// ============================================================================

export const maskCEP = (value: string): string => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

// ============================================================================
// MÁSCARA DE PLACA
// ============================================================================

export const maskPlaca = (value: string): string => {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .replace(/(\w{3})(\d)/, '$1-$2')
    .replace(/(-\d{4})\w+?$/, '$1');
};

// ============================================================================
// MÁSCARA DE MOEDA
// ============================================================================

export const maskMoney = (value: string): string => {
  let numericValue = value.replace(/\D/g, '');

  if (!numericValue) return '';

  // Converte para número e divide por 100 para ter os centavos
  const numberValue = parseFloat(numericValue) / 100;

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numberValue);
};

export const unmaskMoney = (value: string): number => {
  const numericValue = value.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(numericValue) || 0;
};

// ============================================================================
// MÁSCARA DE PORCENTAGEM
// ============================================================================

export const maskPercentage = (value: string): string => {
  const numericValue = value.replace(/\D/g, '');
  const number = parseInt(numericValue) || 0;

  // Limita a 100
  const limitedNumber = Math.min(number, 100);

  return `${limitedNumber}%`;
};

export const unmaskPercentage = (value: string): number => {
  return parseInt(value.replace(/\D/g, '')) || 0;
};

// ============================================================================
// MÁSCARA DE NÚMERO INTEIRO
// ============================================================================

export const maskInteger = (value: string): string => {
  return value.replace(/\D/g, '');
};

// ============================================================================
// MÁSCARA DE NÚMERO DECIMAL
// ============================================================================

export const maskDecimal = (value: string, decimals: number = 2): string => {
  let numericValue = value.replace(/[^\d,]/g, '');

  const parts = numericValue.split(',');
  if (parts.length > 2) {
    numericValue = parts[0] + ',' + parts.slice(1).join('');
  }

  if (parts[1] && parts[1].length > decimals) {
    parts[1] = parts[1].substring(0, decimals);
    numericValue = parts.join(',');
  }

  return numericValue;
};

// ============================================================================
// MÁSCARA DE ANO
// ============================================================================

export const maskYear = (value: string): string => {
  return value.replace(/\D/g, '').substring(0, 4);
};

// ============================================================================
// REMOVER MÁSCARA (LIMPAR)
// ============================================================================

export const unmask = (value: string): string => {
  return value.replace(/\D/g, '');
};

// ============================================================================
// APLICAR MÁSCARA AUTOMATICAMENTE
// ============================================================================

export const applyMask = (
  value: string,
  maskType:
    | 'cpf'
    | 'cnpj'
    | 'phone'
    | 'cep'
    | 'placa'
    | 'money'
    | 'percentage'
    | 'integer'
    | 'year'
): string => {
  switch (maskType) {
    case 'cpf':
      return maskCPF(value);
    case 'cnpj':
      return maskCNPJ(value);
    case 'phone':
      return maskPhone(value);
    case 'cep':
      return maskCEP(value);
    case 'placa':
      return maskPlaca(value);
    case 'money':
      return maskMoney(value);
    case 'percentage':
      return maskPercentage(value);
    case 'integer':
      return maskInteger(value);
    case 'year':
      return maskYear(value);
    default:
      return value;
  }
};

// ============================================================================
// EXPORTAÇÕES
// ============================================================================

export const masks = {
  cpf: maskCPF,
  cnpj: maskCNPJ,
  phone: maskPhone,
  cep: maskCEP,
  placa: maskPlaca,
  money: maskMoney,
  percentage: maskPercentage,
  integer: maskInteger,
  decimal: maskDecimal,
  year: maskYear,
  unmask,
  unmaskMoney,
  unmaskPercentage,
  apply: applyMask,
};

export default masks;
