import React from 'react';
import PropTypes from 'prop-types';
import { Box, MenuItem } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import BuildIcon from '@mui/icons-material/Build';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';

import FormField from '../common/FormField';
import FormSection from '../common/FormSection';
import FormActions from '../common/FormActions';
import { servicoService } from '../../services/servicoService';
import { useNotification } from '../../contexts/NotificationContext';

const validationSchema = Yup.object({
  nome: Yup.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .required('Nome é obrigatório'),
  descricao: Yup.string(),
  precoPadrao: Yup.number()
    .min(0.01, 'Preço deve ser maior que zero')
    .required('Preço padrão é obrigatório'),
  tempoEstimado: Yup.number().min(0, 'Tempo não pode ser negativo'),
  categoria: Yup.string().max(50, 'Categoria deve ter no máximo 50 caracteres'),
  ativo: Yup.boolean(),
});

const ServicoForm = ({ servico, onSave, onCancel }) => {
  const { showSuccess, showError } = useNotification();
  const isEditing = !!(servico && servico.id);

  const initialValues = {
    nome: servico?.nome || '',
    descricao: servico?.descricao || '',
    precoPadrao: servico?.precoPadrao || '',
    tempoEstimado: servico?.tempoEstimado || '',
    categoria: servico?.categoria || '',
    ativo: servico?.ativo !== undefined ? servico.ativo : true,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      nome: values.nome.trim(),
      descricao: values.descricao?.trim() || undefined,
      precoPadrao: parseFloat(values.precoPadrao),
      tempoEstimado: values.tempoEstimado
        ? parseInt(values.tempoEstimado, 10)
        : undefined,
      categoria: values.categoria?.trim() || undefined,
      ativo: values.ativo,
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
            subtitle="Nome, descrição, valor e tempo estimado"
          >
            <Box sx={{ display: 'flex', gap: 2.5, flexDirection: 'column' }}>
              <FormField
                name="nome"
                label="Nome do Serviço"
                placeholder="Ex: Troca de óleo e filtro"
                required
                startIcon={<BuildIcon />}
                inputProps={{ maxLength: 100 }}
                helperText="Nome do serviço oferecido"
              />

              <FormField
                name="descricao"
                label="Descrição"
                placeholder="Descrição detalhada do serviço"
                multiline
                rows={3}
                startIcon={<DescriptionIcon />}
                helperText="Descrição opcional do serviço"
              />

              <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 250px', minWidth: '200px' }}>
                  <FormField
                    name="precoPadrao"
                    label="Preço Padrão (R$)"
                    type="number"
                    placeholder="0.00"
                    required
                    startIcon={<AttachMoneyIcon />}
                    inputProps={{ min: 0.01, step: '0.01' }}
                    helperText="Valor padrão cobrado pelo serviço"
                  />
                </Box>

                <Box sx={{ flex: '1 1 250px', minWidth: '200px' }}>
                  <FormField
                    name="tempoEstimado"
                    label="Tempo Estimado (minutos)"
                    type="number"
                    placeholder="60"
                    startIcon={<AccessTimeIcon />}
                    inputProps={{ min: 0 }}
                    helperText="Tempo médio para execução"
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 250px', minWidth: '200px' }}>
                  <FormField
                    name="categoria"
                    label="Categoria"
                    placeholder="Ex: Manutenção preventiva"
                    startIcon={<CategoryIcon />}
                    inputProps={{ maxLength: 50 }}
                    helperText="Categoria do serviço"
                  />
                </Box>

                <Box sx={{ flex: '1 1 250px', minWidth: '200px' }}>
                  <FormField
                    name="ativo"
                    label="Status"
                    select
                    helperText="Serviços ativos aparecem nas listagens"
                  >
                    <MenuItem value={true}>Ativo</MenuItem>
                    <MenuItem value={false}>Inativo</MenuItem>
                  </FormField>
                </Box>
              </Box>
            </Box>
          </FormSection>

          <FormActions
            onCancel={onCancel}
            loading={isSubmitting}
            submitLabel={isEditing ? 'Atualizar Serviço' : 'Cadastrar Serviço'}
          />
        </form>
      )}
    </Formik>
  );
};

ServicoForm.propTypes = {
  servico: PropTypes.shape({
    id: PropTypes.string,
    nome: PropTypes.string,
    descricao: PropTypes.string,
    precoPadrao: PropTypes.number,
    tempoEstimado: PropTypes.number,
    categoria: PropTypes.string,
    ativo: PropTypes.bool,
  }),
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};

export default ServicoForm;
