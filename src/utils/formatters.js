export const onlyDigits = (v = '') => String(v).replace(/\D/g, '');

export const formatCpfCnpj = (v = '') => {
  const d = onlyDigits(v);
  if (!d) return '';
  if (d.length <= 11) {
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (m, a, b, c, rest) => `${a}${b ? '.' + b : ''}${c ? '.' + c : ''}${rest ? '-' + rest : ''}`);
  }
  return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, (m, a, b, c, d1, e) => `${a}${b ? '.' + b : ''}${c ? '.' + c : ''}${d1 ? '/' + d1 : ''}${e ? '-' + e : ''}`);
};

export const formatTelefone = (v = '') => {
  const d = onlyDigits(v);
  if (!d) return '';
  if (d.length === 11) return d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  if (d.length === 10) return d.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  return v;
};

export const formatCep = (v = '') => {
  const d = onlyDigits(v);
  if (!d) return '';
  if (d.length <= 5) return d;
  return d.replace(/(\d{5})(\d{0,3})/, '$1-$2');
};

export const toRawCpfCnpj = (v = '') => onlyDigits(v);
export const toRawCep = (v = '') => onlyDigits(v);
