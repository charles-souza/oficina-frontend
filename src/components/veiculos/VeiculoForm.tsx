import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import NotesIcon from '@mui/icons-material/Notes';

import FormField from '../common/FormField';
import FormSection from '../common/FormSection';
import FormActions from '../common/FormActions';
import ClienteAutocomplete from '../common/ClienteAutocomplete';
import { veiculoService } from '../../services/veiculoService';
import { useNotification } from '../../contexts/NotificationContext';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants';

const validationSchema = Yup.object({
  placa: Yup.string()
    .required('Placa é obrigatória')
    .matches(/^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/i, 'Placa inválida (formato: ABC-1234 ou ABC1D23)'),
  marca: Yup.string().required('Marca é obrigatória'),
  modelo: Yup.string().required('Modelo é obrigatório'),
  ano: Yup.number()
    .required('Ano é obrigatório')
    .min(1900, 'Ano deve ser maior que 1900')
    .max(2100, 'Ano deve ser menor que 2100')
    .integer('Ano deve ser um número inteiro'),
  cor: Yup.string(),
  chassi: Yup.string()
    .matches(/^[A-HJ-NPR-Z0-9]{17}$|^$/, 'Chassi inválido (deve ter 17 caracteres)'),
  renavam: Yup.string()
    .matches(/^\d{11}$|^$/, 'RENAVAM deve ter 11 dígitos'),
  clienteId: Yup.string().required('ID do cliente é obrigatório'),
  observacoes: Yup.string().max(1000, 'Máximo de 1000 caracteres'),
});

const VeiculoForm = ({ veiculo: propVeiculo, onSave, onCancel }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useNotification();
  const [initializing, setInitializing] = React.useState(!!id);
  const isEditing = !!(id || (propVeiculo && propVeiculo.id));
  const mountedRef = useRef(true);

  const [initialValues, setInitialValues] = React.useState({
    placa: '',
    marca: '',
    modelo: '',
    ano: '',
    cor: '',
    chassi: '',
    renavam: '',
    observacoes: '',
    clienteId: '',
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchVeiculo = async () => {
      const veiculoId = id || (propVeiculo && propVeiculo.id);
      if (!veiculoId) {
        setInitializing(false);
        return;
      }

      try {
        const veiculo = propVeiculo || (await veiculoService.getById(veiculoId));
        if (!mountedRef.current) return;

        setInitialValues({
          placa: veiculo.placa || '',
          marca: veiculo.marca || '',
          modelo: veiculo.modelo || '',
          ano: veiculo.ano || '',
          cor: veiculo.cor || '',
          chassi: veiculo.chassi || '',
          renavam: veiculo.renavam || '',
          observacoes: veiculo.observacoes || '',
          clienteId: veiculo.clienteId || '',
        });
      } catch (err) {
        if (!mountedRef.current) return;
        showError(err.message || ERROR_MESSAGES.LOAD_VEHICLES);
        console.error(err);
      } finally {
        if (mountedRef.current) setInitializing(false);
      }
    };

    fetchVeiculo();
  }, [id, propVeiculo, showError]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      placa: values.placa.toUpperCase().trim(),
      marca: values.marca.trim(),
      modelo: values.modelo.trim(),
      ano: parseInt(values.ano, 10),
      cor: values.cor?.trim() || undefined,
      chassi: values.chassi?.toUpperCase().trim() || undefined,
      renavam: values.renavam?.trim() || undefined,
      observacoes: values.observacoes?.trim() || undefined,
      clienteId: values.clienteId.trim(),
    };

    try {
      const veiculoId = id || (propVeiculo && propVeiculo.id);
      console.log('VeiculoForm - handleSubmit:', {
        isEditing,
        veiculoId,
        propVeiculoId: propVeiculo?.id,
        urlId: id,
        hasOnSave: typeof onSave === 'function'
      });

      if (onSave && typeof onSave === 'function') {
        if (veiculoId) {
          payload.id = veiculoId;
        }
        console.log('VeiculoForm - Chamando onSave com payload:', payload);
        await onSave(payload);
      } else {
        if (isEditing) {
          console.log('VeiculoForm - Atualizando veículo:', veiculoId);
          await veiculoService.update(veiculoId, payload);
          showSuccess(SUCCESS_MESSAGES.SAVE_VEHICLE);
        } else {
          console.log('VeiculoForm - Criando novo veículo');
          await veiculoService.create(payload);
          showSuccess(SUCCESS_MESSAGES.SAVE_VEHICLE);
        }
        navigate('/veiculos');
      }
    } catch (err) {
      console.error('Erro ao salvar veículo:', err);
      if (mountedRef.current) showError(err.message || ERROR_MESSAGES.SAVE_VEHICLE);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate('/veiculos');
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
      {({ handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormSection
              title="Identificação do Veículo"
              subtitle="Informações principais para identificação"
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
                <Box sx={{ flex: '1 1 calc(33.333% - 14px)', minWidth: { xs: '100%', md: 'calc(33.333% - 14px)' } }}>
                  <FormField
                    name="placa"
                    label="Placa"
                    placeholder="ABC-1234"
                    required
                    startIcon={<DirectionsCarIcon />}
                    inputProps={{ maxLength: 10 }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(33.333% - 14px)', minWidth: { xs: '100%', md: 'calc(33.333% - 14px)' } }}>
                  <FormField
                    name="marca"
                    label="Marca"
                    placeholder="Ex: Toyota, Ford, Honda"
                    required
                    inputProps={{ maxLength: 50 }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(33.333% - 14px)', minWidth: { xs: '100%', md: 'calc(33.333% - 14px)' } }}>
                  <FormField
                    name="modelo"
                    label="Modelo"
                    placeholder="Ex: Corolla, Fiesta"
                    required
                    inputProps={{ maxLength: 50 }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(33.333% - 14px)', minWidth: { xs: '100%', md: 'calc(33.333% - 14px)' } }}>
                  <FormField
                    name="ano"
                    label="Ano"
                    type="number"
                    placeholder="2024"
                    required
                    startIcon={<CalendarTodayIcon />}
                    inputProps={{ min: 1900, max: 2100 }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(33.333% - 14px)', minWidth: { xs: '100%', md: 'calc(33.333% - 14px)' } }}>
                  <FormField
                    name="cor"
                    label="Cor"
                    placeholder="Ex: Preto, Branco"
                    startIcon={<ColorLensIcon />}
                    inputProps={{ maxLength: 30 }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(33.333% - 14px)', minWidth: { xs: '100%', md: 'calc(33.333% - 14px)' } }}>
                  <ClienteAutocomplete
                    name="clienteId"
                    label="Cliente"
                    required
                  />
                </Box>
              </Box>
            </FormSection>

            <FormSection
              title="Documentação"
              subtitle="Chassi e Renavam do veículo"
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
                <Box sx={{ flex: '1 1 calc(50% - 10px)', minWidth: { xs: '100%', md: 'calc(50% - 10px)' } }}>
                  <FormField
                    name="chassi"
                    label="Chassi"
                    placeholder="17 caracteres (sem I, O, Q)"
                    startIcon={<FingerprintIcon />}
                    inputProps={{ maxLength: 17 }}
                    helperText="Chassi deve ter exatamente 17 caracteres"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 10px)', minWidth: { xs: '100%', md: 'calc(50% - 10px)' } }}>
                  <FormField
                    name="renavam"
                    label="Renavam"
                    placeholder="11 dígitos"
                    startIcon={<FingerprintIcon />}
                    inputProps={{ maxLength: 11 }}
                    helperText="RENAVAM deve ter exatamente 11 dígitos"
                  />
                </Box>
              </Box>
            </FormSection>

            <FormSection
              title="Observações"
              subtitle="Anotações e informações adicionais"
              divider={false}
            >
              <FormField
                name="observacoes"
                label="Observações"
                placeholder="Digite observações sobre o veículo (histórico, particularidades, etc.)"
                multiline
                rows={4}
                startIcon={<NotesIcon />}
                inputProps={{ maxLength: 1000 }}
              />
            </FormSection>

            <FormActions
              onCancel={handleCancel}
              loading={isSubmitting}
              submitLabel={isEditing ? 'Atualizar Veículo' : 'Cadastrar Veículo'}
            />
          </Box>
        </form>
      )}
    </Formik>
  );
};

VeiculoForm.propTypes = {
  veiculo: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    placa: PropTypes.string,
    marca: PropTypes.string,
    modelo: PropTypes.string,
    ano: PropTypes.string,
    cor: PropTypes.string,
    chassi: PropTypes.string,
    renavam: PropTypes.string,
    observacoes: PropTypes.string,
    clienteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};

export default VeiculoForm;
