import * as Yup from 'yup';

// ============================================================================
// MENSAGENS DE VALIDAÇÃO PADRÃO
// ============================================================================

export const VALIDATION_MESSAGES = {
  required: 'Este campo é obrigatório',
  email: 'E-mail inválido',
  phone: 'Telefone inválido',
  cpf: 'CPF inválido',
  cnpj: 'CNPJ inválido',
  cep: 'CEP inválido',
  minLength: (min: number) => `Mínimo de ${min} caracteres`,
  maxLength: (max: number) => `Máximo de ${max} caracteres`,
  min: (min: number) => `Valor mínimo: ${min}`,
  max: (max: number) => `Valor máximo: ${max}`,
  positive: 'Deve ser um número positivo',
  integer: 'Deve ser um número inteiro',
};

// ============================================================================
// SCHEMAS DE CAMPOS COMUNS
// ============================================================================

export const commonFields = {
  // Campos de texto
  requiredString: Yup.string().required(VALIDATION_MESSAGES.required),
  optionalString: Yup.string(),

  // E-mail
  email: Yup.string()
    .email(VALIDATION_MESSAGES.email)
    .required(VALIDATION_MESSAGES.required),
  optionalEmail: Yup.string().email(VALIDATION_MESSAGES.email),

  // Telefone
  phone: Yup.string()
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, VALIDATION_MESSAGES.phone),

  // CPF
  cpf: Yup.string()
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, VALIDATION_MESSAGES.cpf),

  // CNPJ
  cnpj: Yup.string()
    .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, VALIDATION_MESSAGES.cnpj),

  // CEP
  cep: Yup.string()
    .matches(/^\d{5}-\d{3}$/, VALIDATION_MESSAGES.cep),

  // Números
  positiveNumber: Yup.number()
    .positive(VALIDATION_MESSAGES.positive)
    .required(VALIDATION_MESSAGES.required),
  optionalPositiveNumber: Yup.number().positive(VALIDATION_MESSAGES.positive),

  // Data
  date: Yup.date().required(VALIDATION_MESSAGES.required),
  optionalDate: Yup.date(),
};

// ============================================================================
// SCHEMA: CLIENTE
// ============================================================================

export const clienteSchema = Yup.object({
  nome: commonFields.requiredString,
  email: commonFields.optionalEmail,
  telefone: commonFields.phone,
  cpf: commonFields.cpf,
  cnpj: commonFields.cnpj,
  cep: commonFields.cep,
  endereco: commonFields.optionalString,
  numero: commonFields.optionalString,
  complemento: commonFields.optionalString,
  bairro: commonFields.optionalString,
  cidade: commonFields.optionalString,
  estado: Yup.string().max(2, 'Máximo de 2 caracteres'),
  observacoes: Yup.string().max(1000, VALIDATION_MESSAGES.maxLength(1000)),
});

// ============================================================================
// SCHEMA: VEÍCULO
// ============================================================================

export const veiculoSchema = Yup.object({
  placa: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .matches(/^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/i, 'Placa inválida (formato: ABC-1234 ou ABC1D23)'),
  marca: commonFields.requiredString,
  modelo: commonFields.requiredString,
  ano: Yup.number()
    .required(VALIDATION_MESSAGES.required)
    .min(1900, VALIDATION_MESSAGES.min(1900))
    .max(2100, VALIDATION_MESSAGES.max(2100))
    .integer(VALIDATION_MESSAGES.integer),
  cor: commonFields.optionalString,
  chassi: Yup.string()
    .matches(/^[A-HJ-NPR-Z0-9]{17}$|^$/, 'Chassi inválido (deve ter 17 caracteres)'),
  renavam: Yup.string()
    .matches(/^\d{11}$|^$/, 'RENAVAM deve ter 11 dígitos'),
  clienteId: commonFields.requiredString,
  observacoes: Yup.string().max(1000, VALIDATION_MESSAGES.maxLength(1000)),
});

// ============================================================================
// SCHEMA: ORÇAMENTO
// ============================================================================

export const orcamentoSchema = Yup.object({
  clienteId: commonFields.requiredString,
  veiculoId: commonFields.requiredString,
  dataEmissao: commonFields.date,
  dataValidade: commonFields.date,
  descricao: commonFields.optionalString,
  observacoes: Yup.string().max(1000, VALIDATION_MESSAGES.maxLength(1000)),
  desconto: Yup.number()
    .min(0, VALIDATION_MESSAGES.min(0))
    .max(100, VALIDATION_MESSAGES.max(100)),
  itens: Yup.array().of(
    Yup.object({
      tipo: Yup.string()
        .oneOf(['SERVICO', 'PECA'], 'Tipo inválido')
        .required(VALIDATION_MESSAGES.required),
      descricao: commonFields.requiredString,
      quantidade: Yup.number()
        .positive(VALIDATION_MESSAGES.positive)
        .integer(VALIDATION_MESSAGES.integer)
        .required(VALIDATION_MESSAGES.required),
      valorUnitario: commonFields.positiveNumber,
    })
  ),
});

// ============================================================================
// SCHEMA: ORDEM DE SERVIÇO
// ============================================================================

export const ordemServicoSchema = Yup.object({
  clienteId: commonFields.requiredString,
  veiculoId: commonFields.requiredString,
  orcamentoId: commonFields.optionalString,
  dataAbertura: commonFields.date,
  dataConclusao: commonFields.optionalDate,
  dataEntrega: commonFields.optionalDate,
  descricao: commonFields.optionalString,
  observacoes: Yup.string().max(1000, VALIDATION_MESSAGES.maxLength(1000)),
  desconto: Yup.number()
    .min(0, VALIDATION_MESSAGES.min(0))
    .max(100, VALIDATION_MESSAGES.max(100)),
  itens: Yup.array().of(
    Yup.object({
      tipo: Yup.string()
        .oneOf(['SERVICO', 'PECA'], 'Tipo inválido')
        .required(VALIDATION_MESSAGES.required),
      descricao: commonFields.requiredString,
      quantidade: Yup.number()
        .positive(VALIDATION_MESSAGES.positive)
        .integer(VALIDATION_MESSAGES.integer)
        .required(VALIDATION_MESSAGES.required),
      valorUnitario: commonFields.positiveNumber,
    })
  ),
});

// ============================================================================
// SCHEMA: RECIBO
// ============================================================================

export const reciboSchema = Yup.object({
  ordemServicoId: commonFields.requiredString,
  dataEmissao: commonFields.date,
  valorTotal: commonFields.positiveNumber,
  formaPagamento: Yup.string()
    .oneOf(['DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'TRANSFERENCIA'], 'Forma de pagamento inválida')
    .required(VALIDATION_MESSAGES.required),
  observacoes: Yup.string().max(500, VALIDATION_MESSAGES.maxLength(500)),
});

// ============================================================================
// SCHEMA: SERVIÇO (CATÁLOGO)
// ============================================================================

export const servicoSchema = Yup.object({
  nome: commonFields.requiredString
    .min(3, VALIDATION_MESSAGES.minLength(3))
    .max(100, VALIDATION_MESSAGES.maxLength(100)),
  descricao: commonFields.optionalString,
  precoPadrao: commonFields.positiveNumber,
  tempoEstimado: Yup.number()
    .positive(VALIDATION_MESSAGES.positive)
    .integer(VALIDATION_MESSAGES.integer),
  categoria: Yup.string().max(50, VALIDATION_MESSAGES.maxLength(50)),
  ativo: Yup.boolean(),
});

// ============================================================================
// SCHEMA: USUÁRIO/PERFIL
// ============================================================================

export const perfilSchema = Yup.object({
  nome: commonFields.requiredString,
  email: commonFields.email,
  telefone: commonFields.phone,
  cargo: commonFields.optionalString,
});

// ============================================================================
// SCHEMA: ALTERAÇÃO DE SENHA
// ============================================================================

export const senhaSchema = Yup.object({
  senhaAtual: commonFields.requiredString,
  novaSenha: Yup.string()
    .min(6, VALIDATION_MESSAGES.minLength(6))
    .required(VALIDATION_MESSAGES.required),
  confirmarSenha: Yup.string()
    .oneOf([Yup.ref('novaSenha')], 'As senhas não coincidem')
    .required(VALIDATION_MESSAGES.required),
});

// ============================================================================
// SCHEMA: LOGIN
// ============================================================================

export const loginSchema = Yup.object({
  email: commonFields.email,
  senha: commonFields.requiredString,
});

// ============================================================================
// EXPORTAÇÕES CONSOLIDADAS
// ============================================================================

export const validationSchemas = {
  cliente: clienteSchema,
  veiculo: veiculoSchema,
  orcamento: orcamentoSchema,
  ordemServico: ordemServicoSchema,
  recibo: reciboSchema,
  servico: servicoSchema,
  perfil: perfilSchema,
  senha: senhaSchema,
  login: loginSchema,
};

export default validationSchemas;
