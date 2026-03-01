import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, CircularProgress, Box } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import NotesIcon from '@mui/icons-material/Notes';

import FormContainer from '../common/FormContainer';
import FormField from '../common/FormField';
import FormSection from '../common/FormSection';
import FormActions from '../common/FormActions';
import { clienteService } from '../../services/clienteService';
import { cepService } from '../../services/cepService';
import { useNotification } from '../../contexts/NotificationContext';
import { onlyDigits, formatCpfCnpj, formatTelefone, formatCep } from '../../utils/formatters';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants';

const validationSchema = Yup.object({
  nome: Yup.string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido'),
  cpfCnpj: Yup.string(),
  telefone: Yup.string(),
  cep: Yup.string(),
  cidade: Yup.string(),
  estado: Yup.string().max(2, 'Use a sigla do estado (ex: SP)'),
  bairro: Yup.string(),
  rua: Yup.string(),
  numero: Yup.string(),
  complemento: Yup.string(),
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
    email: '',
    cpfCnpj: '',
    telefone: '',
    cep: '',
    cidade: '',
    estado: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: '',
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
          email: cliente.email || '',
          cpfCnpj: cliente.cpfCnpj || '',
          telefone: cliente.telefone || '',
          cep: cliente.cep ? formatCep(cliente.cep) : '',
          cidade: cliente.cidade || '',
          estado: cliente.estado || '',
          bairro: cliente.bairro || '',
          rua: cliente.endereco || cliente.rua || '',
          numero: cliente.numero || '',
          complemento: cliente.complemento || '',
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

      if (address.rua) setFieldValue('rua', address.rua);
      if (address.complemento) setFieldValue('complemento', address.complemento);
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
      nome: values.nome || '',
      cpfCnpj: onlyDigits(values.cpfCnpj || ''),
      telefone: values.telefone || '',
      email: values.email || '',
      endereco: values.rua
        ? `${values.rua}${values.numero ? ', ' + values.numero : ''}${
            values.complemento ? ' - ' + values.complemento : ''
          }`
        : '',
      bairro: values.bairro || '',
      cidade: values.cidade || '',
      estado: values.estado || '',
      cep: onlyDigits(values.cep || ''),
      observacoes: values.observacoes || '',
    };

    try {
      if (onSave && typeof onSave === 'function') {
        await onSave(payload);
        showSuccess(SUCCESS_MESSAGES.SAVE_CLIENT);
      } else {
        if (isEditing) {
          const clienteId = id || (propCliente && propCliente.id);
          await clienteService.update(clienteId, payload);
          showSuccess(SUCCESS_MESSAGES.SAVE_CLIENT);
        } else {
          await clienteService.create(payload);
          showSuccess(SUCCESS_MESSAGES.SAVE_CLIENT);
        }
        navigate('/clientes');
      }
    } catch (err) {
      if (mountedRef.current) showError(ERROR_MESSAGES.SAVE_CLIENT);
      console.error(err);
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
    <FormContainer
      title={isEditing ? 'Editar Cliente' : 'Novo Cliente'}
      subtitle={
        isEditing
          ? 'Atualize as informações do cliente'
          : 'Preencha os dados para cadastrar um novo cliente'
      }
      maxWidth={900}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <FormSection
              title="Dados Pessoais"
              subtitle="Informações básicas do cliente"
            >
              <Grid container spacing={2.5}>
                <Grid xs={12} md={6}>
                  <FormField
                    name="nome"
                    label="Nome"
                    placeholder="Digite o nome completo"
                    required
                    startIcon={<PersonIcon />}
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <FormField
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="exemplo@email.com"
                    startIcon={<EmailIcon />}
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>

                <Grid xs={12} md={6}>
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
                </Grid>

                <Grid xs={12} md={6}>
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
                </Grid>
              </Grid>
            </FormSection>

            <FormSection
              title="Endereço"
              subtitle="Localização e dados de contato"
            >
              <Grid container spacing={2.5}>
                <Grid xs={12} md={3}>
                  <FormField
                    name="cep"
                    label="CEP"
                    placeholder="00000-000"
                    startIcon={<LocationOnIcon />}
                    loading={cepLoading}
                    helperText={cepLoading ? 'Consultando CEP...' : 'Busca automática de endereço'}
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
                </Grid>

                <Grid xs={12} md={6}>
                  <FormField
                    name="cidade"
                    label="Cidade"
                    placeholder="Nome da cidade"
                    inputProps={{ maxLength: 60 }}
                  />
                </Grid>

                <Grid xs={12} md={3}>
                  <FormField
                    name="estado"
                    label="Estado"
                    placeholder="UF"
                    inputProps={{ maxLength: 2 }}
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <FormField
                    name="bairro"
                    label="Bairro"
                    placeholder="Nome do bairro"
                    inputProps={{ maxLength: 80 }}
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <FormField
                    name="rua"
                    label="Rua"
                    placeholder="Nome da rua"
                    startIcon={<HomeIcon />}
                    inputProps={{ maxLength: 120 }}
                  />
                </Grid>

                <Grid xs={12} md={3}>
                  <FormField
                    name="numero"
                    label="Número"
                    placeholder="000"
                    inputProps={{ maxLength: 12 }}
                  />
                </Grid>

                <Grid xs={12} md={9}>
                  <FormField
                    name="complemento"
                    label="Complemento"
                    placeholder="Apartamento, bloco, etc."
                    inputProps={{ maxLength: 80 }}
                  />
                </Grid>
              </Grid>
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
          </form>
        )}
      </Formik>
    </FormContainer>
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
    rua: PropTypes.string,
    endereco: PropTypes.string,
    numero: PropTypes.string,
    complemento: PropTypes.string,
    observacoes: PropTypes.string,
  }),
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};

export default ClienteForm;
