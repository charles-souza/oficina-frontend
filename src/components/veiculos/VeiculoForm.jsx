import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, CircularProgress, Box } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PersonIcon from '@mui/icons-material/Person';
import NotesIcon from '@mui/icons-material/Notes';

import FormContainer from '../common/FormContainer';
import FormField from '../common/FormField';
import FormSection from '../common/FormSection';
import FormActions from '../common/FormActions';
import { veiculoService } from '../../services/veiculoService';
import { useNotification } from '../../contexts/NotificationContext';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants';

const validationSchema = Yup.object({
  placa: Yup.string().required('Placa é obrigatória'),
  marca: Yup.string(),
  modelo: Yup.string(),
  ano: Yup.string().matches(/^\d{0,4}$/, 'Ano inválido'),
  cor: Yup.string(),
  chassi: Yup.string(),
  renavam: Yup.string(),
  clienteId: Yup.string(),
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
    const payload = { ...values };

    try {
      if (onSave && typeof onSave === 'function') {
        await onSave(payload);
        showSuccess(SUCCESS_MESSAGES.SAVE_VEHICLE);
      } else {
        if (isEditing) {
          const veiculoId = id || (propVeiculo && propVeiculo.id);
          await veiculoService.update(veiculoId, payload);
          showSuccess(SUCCESS_MESSAGES.SAVE_VEHICLE);
        } else {
          await veiculoService.create(payload);
          showSuccess(SUCCESS_MESSAGES.SAVE_VEHICLE);
        }
        navigate('/veiculos');
      }
    } catch (err) {
      console.error(err);
      if (mountedRef.current) showError(ERROR_MESSAGES.SAVE_VEHICLE);
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
    <FormContainer
      title={isEditing ? 'Editar Veículo' : 'Novo Veículo'}
      subtitle={
        isEditing
          ? 'Atualize as informações do veículo'
          : 'Cadastre um novo veículo no sistema'
      }
      maxWidth={900}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <FormSection
              title="Identificação do Veículo"
              subtitle="Informações principais para identificação"
            >
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={4}>
                  <FormField
                    name="placa"
                    label="Placa"
                    placeholder="ABC-1234"
                    required
                    startIcon={<DirectionsCarIcon />}
                    inputProps={{ maxLength: 10 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormField
                    name="marca"
                    label="Marca"
                    placeholder="Ex: Toyota, Ford, Honda"
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormField
                    name="modelo"
                    label="Modelo"
                    placeholder="Ex: Corolla, Fiesta"
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormField
                    name="ano"
                    label="Ano"
                    placeholder="2024"
                    startIcon={<CalendarTodayIcon />}
                    inputProps={{ maxLength: 4 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormField
                    name="cor"
                    label="Cor"
                    placeholder="Ex: Preto, Branco"
                    startIcon={<ColorLensIcon />}
                    inputProps={{ maxLength: 30 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormField
                    name="clienteId"
                    label="ID do Cliente"
                    placeholder="Informe o ID do proprietário"
                    startIcon={<PersonIcon />}
                    helperText="ID do cliente proprietário do veículo"
                  />
                </Grid>
              </Grid>
            </FormSection>

            <FormSection
              title="Documentação"
              subtitle="Chassi e Renavam do veículo"
            >
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <FormField
                    name="chassi"
                    label="Chassi"
                    placeholder="Digite o número do chassi"
                    startIcon={<FingerprintIcon />}
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormField
                    name="renavam"
                    label="Renavam"
                    placeholder="Digite o número do Renavam"
                    startIcon={<FingerprintIcon />}
                    inputProps={{ maxLength: 20 }}
                  />
                </Grid>
              </Grid>
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
          </form>
        )}
      </Formik>
    </FormContainer>
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
