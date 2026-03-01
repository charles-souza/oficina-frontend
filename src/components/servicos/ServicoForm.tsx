import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import BuildIcon from '@mui/icons-material/Build';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import FormContainer from '../common/FormContainer';
import FormField from '../common/FormField';
import FormSection from '../common/FormSection';
import FormActions from '../common/FormActions';
import { servicoService } from '../../services/servicoService';
import { useNotification } from '../../contexts/NotificationContext';

const validationSchema = Yup.object({
  descricao: Yup.string()
    .min(3, 'Descrição deve ter no mínimo 3 caracteres')
    .required('Descrição é obrigatória'),
  preco: Yup.number()
    .min(0.01, 'Preço deve ser maior que zero')
    .required('Preço é obrigatório'),
  tempoEstimadoMinutos: Yup.number().min(0, 'Tempo não pode ser negativo'),
});

const ServicoForm = ({ servico, onSave, onCancel }) => {
  const { showSuccess, showError } = useNotification();
  const isEditing = !!(servico && servico.id);

  const initialValues = {
    descricao: servico?.descricao || '',
    preco: servico?.preco || '',
    tempoEstimadoMinutos: servico?.tempoEstimadoMinutos || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      descricao: values.descricao.trim(),
      preco: parseFloat(values.preco),
      tempoEstimadoMinutos: values.tempoEstimadoMinutos
        ? parseInt(values.tempoEstimadoMinutos, 10)
        : null,
    };

    try {
      if (isEditing) {
        await servicoService.update(servico.id, payload);
        showSuccess('Serviço atualizado com sucesso!');
      } else {
        await servicoService.create(payload);
        showSuccess('Serviço criado com sucesso!');
      }
      if (onSave) onSave(payload);
    } catch (err) {
      console.error('Erro ao salvar serviço:', err);
      showError(err.message || 'Erro ao salvar serviço');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormContainer
      title={isEditing ? 'Editar Serviço' : 'Novo Serviço'}
      subtitle={
        isEditing
          ? 'Atualize as informações do serviço'
          : 'Cadastre um novo serviço no catálogo'
      }
      maxWidth={700}
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
              title="Informações do Serviço"
              subtitle="Descrição, valor e tempo estimado"
              divider={false}
            >
              <Grid container spacing={2.5}>
                <Grid xs={12}>
                  <FormField
                    name="descricao"
                    label="Descrição do Serviço"
                    placeholder="Ex: Troca de óleo e filtro"
                    required
                    startIcon={<BuildIcon />}
                    inputProps={{ maxLength: 200 }}
                    helperText="Nome ou descrição do serviço oferecido"
                  />
                </Grid>

                <Grid xs={12} sm={6}>
                  <FormField
                    name="preco"
                    label="Preço (R$)"
                    type="number"
                    placeholder="0.00"
                    required
                    startIcon={<AttachMoneyIcon />}
                    inputProps={{ min: 0, step: '0.01' }}
                    helperText="Valor cobrado pelo serviço"
                  />
                </Grid>

                <Grid xs={12} sm={6}>
                  <FormField
                    name="tempoEstimadoMinutos"
                    label="Tempo Estimado (minutos)"
                    type="number"
                    placeholder="60"
                    startIcon={<AccessTimeIcon />}
                    inputProps={{ min: 0 }}
                    helperText="Tempo médio para execução"
                  />
                </Grid>
              </Grid>
            </FormSection>

            <FormActions
              onCancel={onCancel}
              loading={isSubmitting}
              submitLabel={isEditing ? 'Atualizar Serviço' : 'Cadastrar Serviço'}
            />
          </form>
        )}
      </Formik>
    </FormContainer>
  );
};

ServicoForm.propTypes = {
  servico: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    descricao: PropTypes.string,
    preco: PropTypes.number,
    tempoEstimadoMinutos: PropTypes.number,
  }),
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};

export default ServicoForm;
