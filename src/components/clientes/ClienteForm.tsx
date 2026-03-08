import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import NotesIcon from '@mui/icons-material/Notes';

import FormSection from '../common/FormSection';
import FormField from '../common/FormField';
import FormActions from '../common/FormActions';
import { clienteService } from '../../services/clienteService';
import { cepService } from '../../services/cepService';
import { useNotification } from '../../contexts/NotificationContext';
import { onlyDigits, formatCpfCnpj, formatTelefone, formatCep } from '../../utils/formatters';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants';

const validationSchema = Yup.object({
  nome: Yup.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .required('Nome é obrigatório'),
  cpfCnpj: Yup.string()
    .test('cpf-cnpj', 'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos', (value) => {
      if (!value) return true;
      const digits = onlyDigits(value);
      return digits.length === 11 || digits.length === 14;
    }),
  telefone: Yup.string()
    .test('telefone', 'Telefone inválido', (value) => {
      if (!value) return true;
      const digits = onlyDigits(value);
      return digits.length >= 10 && digits.length <= 11;
    }),
  email: Yup.string().email('Email inválido'),
  cep: Yup.string()
    .test('cep', 'CEP deve ter 8 dígitos', (value) => {
      if (!value) return true;
      const digits = onlyDigits(value);
      return digits.length === 8;
    }),
  endereco: Yup.string(),
  bairro: Yup.string(),
  cidade: Yup.string(),
  estado: Yup.string()
    .test('estado', 'Estado deve ter 2 caracteres', (value) => {
      if (!value) return true;
      return value.length === 2;
    }),
  observacoes: Yup.string().max(1000, 'Máximo de 1000 caracteres'),
});

const ClienteForm = ({ cliente: propCliente, onSave, onCancel }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useNotification();
  const [initializing, setInitializing] = React.useState(!!id);
  const [cepLoading, setCepLoading] = React.useState(false);
  const isEditing = !!(id || (propCliente && propCliente.id));

  const mountedRef = useRef(true);
  const cepDebounceRef = useRef(null);
  const cepAbortControllerRef = useRef(null);
  const lastCepRef = useRef('');

  const [initialValues, setInitialValues] = React.useState({
    nome: '',
    cpfCnpj: '',
    telefone: '',
    email: '',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    observacoes: '',
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (cepDebounceRef.current) clearTimeout(cepDebounceRef.current);
      if (cepAbortControllerRef.current) cepAbortControllerRef.current.abort();
    };
  }, []);

  useEffect(() => {
    const fetchCliente = async () => {
      const clienteId = id || (propCliente && propCliente.id);
      if (!clienteId) {
        setInitializing(false);
        return;
      }

      try {
        const cliente = propCliente || (await clienteService.getById(clienteId));
        if (!mountedRef.current) return;

        setInitialValues({
          nome: cliente.nome || '',
          cpfCnpj: cliente.cpfCnpj ? formatCpfCnpj(cliente.cpfCnpj) : '',
          telefone: cliente.telefone ? formatTelefone(cliente.telefone) : '',
          email: cliente.email || '',
          endereco: cliente.endereco || '',
          bairro: cliente.bairro || '',
          cidade: cliente.cidade || '',
          estado: cliente.estado || '',
          cep: cliente.cep ? formatCep(cliente.cep) : '',
          observacoes: cliente.observacoes || '',
        });
      } catch (err) {
        if (!mountedRef.current) return;
        showError(ERROR_MESSAGES.LOAD_CLIENTS);
        console.error(err);
      } finally {
        if (mountedRef.current) setInitializing(false);
      }
    };

    fetchCliente();
  }, [id, propCliente, showError]);

  const triggerCepLookup = async (cepValue, setFieldValue) => {
    const cleaned = onlyDigits(cepValue || '');
    if (cleaned.length !== 8) return;
    if (lastCepRef.current === cleaned) return;

    if (cepAbortControllerRef.current) {
      cepAbortControllerRef.current.abort();
    }

    cepAbortControllerRef.current = new AbortController();
    setCepLoading(true);

    try {
      const address = await cepService.getAddressByCep(cleaned, cepAbortControllerRef.current.signal);
      if (!mountedRef.current) return;

      lastCepRef.current = cleaned;

      if (address.rua) setFieldValue('endereco', address.rua);
      if (address.bairro) setFieldValue('bairro', address.bairro);
      if (address.cidade) setFieldValue('cidade', address.cidade);
      if (address.estado) setFieldValue('estado', address.estado);
    } catch (err) {
      if (err.name === 'AbortError' || err.name === 'CanceledError') return;
      console.error('CEP lookup failed:', err);
      if (mountedRef.current) showError(err.message || ERROR_MESSAGES.CEP_LOOKUP);
    } finally {
      if (mountedRef.current) setCepLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      nome: values.nome.trim(),
      cpfCnpj: onlyDigits(values.cpfCnpj || ''),
      telefone: onlyDigits(values.telefone || ''),
      email: values.email?.trim() || undefined,
      endereco: values.endereco?.trim() || undefined,
      bairro: values.bairro?.trim() || undefined,
      cidade: values.cidade?.trim() || undefined,
      estado: values.estado?.toUpperCase().trim() || undefined,
      cep: onlyDigits(values.cep || ''),
      observacoes: values.observacoes?.trim() || undefined,
    };

    try {
      const clienteId = id || (propCliente && propCliente.id);
      console.log('ClienteForm - handleSubmit:', {
        isEditing,
        clienteId,
        propClienteId: propCliente?.id,
        urlId: id,
        hasOnSave: typeof onSave === 'function'
      });

      if (onSave && typeof onSave === 'function') {
        if (clienteId) {
          payload.id = clienteId;
        }
        console.log('ClienteForm - Chamando onSave com payload:', payload);
        await onSave(payload);
      } else {
        if (isEditing) {
          console.log('ClienteForm - Atualizando cliente:', clienteId);
          await clienteService.update(clienteId, payload);
          showSuccess(SUCCESS_MESSAGES.SAVE_CLIENT);
        } else {
          console.log('ClienteForm - Criando novo cliente');
          await clienteService.create(payload);
          showSuccess(SUCCESS_MESSAGES.SAVE_CLIENT);
        }
        navigate('/clientes');
      }
    } catch (err) {
      if (mountedRef.current) showError(ERROR_MESSAGES.SAVE_CLIENT);
      console.error(err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate('/clientes');
  };

  if (initializing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, width: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ handleSubmit, isSubmitting, setFieldValue }) => (
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormSection
              title="Dados Pessoais"
              subtitle="Informações básicas do cliente"
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
                <Box sx={{ flex: '1 1 calc(50% - 10px)', minWidth: { xs: '100%', md: 'calc(50% - 10px)' } }}>
                  <FormField
                    name="nome"
                    label="Nome"
                    placeholder="Digite o nome completo"
                    required
                    startIcon={<PersonIcon />}
                    inputProps={{ maxLength: 100 }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 10px)', minWidth: { xs: '100%', md: 'calc(50% - 10px)' } }}>
                  <FormField
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="exemplo@email.com"
                    startIcon={<EmailIcon />}
                    inputProps={{ maxLength: 100 }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 10px)', minWidth: { xs: '100%', md: 'calc(50% - 10px)' } }}>
                  <FormField
                    name="cpfCnpj"
                    label="CPF/CNPJ"
                    placeholder="000.000.000-00"
                    startIcon={<BadgeIcon />}
                    onChange={(e) => {
                      const formatted = formatCpfCnpj(e.target.value);
                      setFieldValue('cpfCnpj', formatted);
                    }}
                    inputProps={{ maxLength: 18 }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 10px)', minWidth: { xs: '100%', md: 'calc(50% - 10px)' } }}>
                  <FormField
                    name="telefone"
                    label="Telefone"
                    placeholder="(00) 00000-0000"
                    startIcon={<PhoneIcon />}
                    onChange={(e) => {
                      const formatted = formatTelefone(e.target.value);
                      setFieldValue('telefone', formatted);
                    }}
                    inputProps={{ maxLength: 15 }}
                  />
                </Box>
              </Box>
            </FormSection>

            <FormSection
              title="Endereço"
              subtitle="Localização e dados de contato"
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
                <Box sx={{ flex: '1 1 calc(25% - 15px)', minWidth: { xs: '100%', md: 'calc(25% - 15px)' } }}>
                  <FormField
                    name="cep"
                    label="CEP"
                    placeholder="00000-000"
                    startIcon={<LocationOnIcon />}
                    loading={cepLoading}
                    helperText={cepLoading ? 'Consultando CEP...' : 'Busca automática'}
                    onChange={(e) => {
                      const formatted = formatCep(e.target.value);
                      setFieldValue('cep', formatted);

                      if (cepDebounceRef.current) clearTimeout(cepDebounceRef.current);
                      cepDebounceRef.current = setTimeout(() => {
                        triggerCepLookup(formatted, setFieldValue);
                      }, 500);
                    }}
                    inputProps={{ maxLength: 9 }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 10px)', minWidth: { xs: '100%', md: 'calc(50% - 10px)' } }}>
                  <FormField
                    name="cidade"
                    label="Cidade"
                    placeholder="Nome da cidade"
                    inputProps={{ maxLength: 60 }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(25% - 15px)', minWidth: { xs: '100%', md: 'calc(25% - 15px)' } }}>
                  <FormField
                    name="estado"
                    label="Estado"
                    placeholder="UF"
                    inputProps={{ maxLength: 2 }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 10px)', minWidth: { xs: '100%', md: 'calc(50% - 10px)' } }}>
                  <FormField
                    name="bairro"
                    label="Bairro"
                    placeholder="Nome do bairro"
                    inputProps={{ maxLength: 80 }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 100%' }}>
                  <FormField
                    name="endereco"
                    label="Endereço"
                    placeholder="Rua, número, complemento"
                    startIcon={<HomeIcon />}
                    inputProps={{ maxLength: 200 }}
                    helperText="Endereço completo (rua, número, complemento)"
                  />
                </Box>
              </Box>
            </FormSection>

            <FormSection
              title="Observações"
              subtitle="Informações adicionais sobre o cliente"
              divider={false}
            >
              <FormField
                name="observacoes"
                label="Observações"
                placeholder="Digite observações relevantes sobre o cliente"
                multiline
                rows={4}
                startIcon={<NotesIcon />}
                inputProps={{ maxLength: 1000 }}
              />
            </FormSection>

            <FormActions
              onCancel={handleCancel}
              loading={isSubmitting}
              submitLabel={isEditing ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
            />
          </Box>
        </form>
      )}
    </Formik>
  );
};

ClienteForm.propTypes = {
  cliente: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    nome: PropTypes.string,
    email: PropTypes.string,
    cpfCnpj: PropTypes.string,
    telefone: PropTypes.string,
    cep: PropTypes.string,
    cidade: PropTypes.string,
    estado: PropTypes.string,
    bairro: PropTypes.string,
    endereco: PropTypes.string,
    observacoes: PropTypes.string,
  }),
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};

export default ClienteForm;
