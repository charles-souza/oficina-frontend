/**
 * Utilitários de validação personalizados
 */

// ============================================================================
// VALIDAÇÃO DE CPF
// ============================================================================

export const isValidCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCPF)) return false;

  // Valida os dígitos verificadores
  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
};

// ============================================================================
// VALIDAÇÃO DE CNPJ
// ============================================================================

export const isValidCNPJ = (cnpj: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/\D/g, '');

  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;

  // Valida os dígitos verificadores
  let length = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, length);
  const digits = cleanCNPJ.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  length = length + 1;
  numbers = cleanCNPJ.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
};

// ============================================================================
// VALIDAÇÃO DE E-MAIL
// ============================================================================

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ============================================================================
// VALIDAÇÃO DE TELEFONE
// ============================================================================

export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 10 || cleanPhone.length === 11;
};

// ============================================================================
// VALIDAÇÃO DE CEP
// ============================================================================

export const isValidCEP = (cep: string): boolean => {
  const cleanCEP = cep.replace(/\D/g, '');
  return cleanCEP.length === 8;
};

// ============================================================================
// VALIDAÇÃO DE PLACA DE VEÍCULO
// ============================================================================

export const isValidPlaca = (placa: string): boolean => {
  // Placa antiga: ABC-1234
  const placaAntigaRegex = /^[A-Z]{3}-\d{4}$/;
  // Placa Mercosul: ABC1D34
  const placaMercosulRegex = /^[A-Z]{3}\d[A-Z]\d{2}$/;

  const cleanPlaca = placa.toUpperCase().replace(/\s/g, '');
  return placaAntigaRegex.test(cleanPlaca) || placaMercosulRegex.test(cleanPlaca);
};

// ============================================================================
// VALIDAÇÃO DE SENHA FORTE
// ============================================================================

export const isStrongPassword = (password: string): boolean => {
  // Mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula e um número
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return strongPasswordRegex.test(password);
};

export const getPasswordStrength = (
  password: string
): 'weak' | 'medium' | 'strong' => {
  if (password.length < 6) return 'weak';
  if (password.length < 8) return 'medium';

  let strength = 0;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;

  if (strength < 2) return 'weak';
  if (strength < 4) return 'medium';
  return 'strong';
};

// ============================================================================
// VALIDAÇÃO DE VALORES MONETÁRIOS
// ============================================================================

export const isValidMoney = (value: string | number): boolean => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(numValue) && numValue >= 0;
};

export const formatMoney = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// ============================================================================
// VALIDAÇÃO DE PORCENTAGEM
// ============================================================================

export const isValidPercentage = (value: number): boolean => {
  return !isNaN(value) && value >= 0 && value <= 100;
};

// ============================================================================
// EXPORTAÇÕES
// ============================================================================

export const validators = {
  cpf: isValidCPF,
  cnpj: isValidCNPJ,
  email: isValidEmail,
  phone: isValidPhone,
  cep: isValidCEP,
  placa: isValidPlaca,
  strongPassword: isStrongPassword,
  passwordStrength: getPasswordStrength,
  money: isValidMoney,
  percentage: isValidPercentage,
};

export default validators;
