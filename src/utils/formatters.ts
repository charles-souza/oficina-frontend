export const onlyDigits = (v: string | number = ''): string => String(v).replace(/\D/g, '');

export const formatCpfCnpj = (v: string | number = ''): string => {
  const d = onlyDigits(v);
  if (!d) return '';
  if (d.length <= 11) {
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_m, a, b, c, rest) => `${a}${b ? '.' + b : ''}${c ? '.' + c : ''}${rest ? '-' + rest : ''}`);
  }
  return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, (_m, a, b, c, d1, e) => `${a}${b ? '.' + b : ''}${c ? '.' + c : ''}${d1 ? '/' + d1 : ''}${e ? '-' + e : ''}`);
};

export const formatTelefone = (v: string | number = ''): string => {
  const d = onlyDigits(v);
  if (!d) return '';
  if (d.length === 11) return d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  if (d.length === 10) return d.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  return String(v);
};

export const formatCep = (v: string | number = ''): string => {
  const d = onlyDigits(v);
  if (!d) return '';
  if (d.length <= 5) return d;
  return d.replace(/(\d{5})(\d{0,3})/, '$1-$2');
};

export const toRawCpfCnpj = (v: string | number = ''): string => onlyDigits(v);
export const toRawCep = (v: string | number = ''): string => onlyDigits(v);
