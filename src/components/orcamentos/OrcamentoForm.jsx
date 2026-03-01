import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Box, IconButton, Typography } from '@mui/material';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import NotesIcon from '@mui/icons-material/Notes';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import FormContainer from '../common/FormContainer';
import FormField from '../common/FormField';
import FormSection from '../common/FormSection';
import FormActions from '../common/FormActions';
import { orcamentoService } from '../../services/orcamentoService';
import { useNotification } from '../../contexts/NotificationContext';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants';

const itemSchema = Yup.object({
  tipo: Yup.string(),
  descricao: Yup.string(),
  quantidade: Yup.number().min(1, 'Quantidade mínima é 1'),
  valorUnitario: Yup.number().min(0, 'Valor deve ser positivo'),
});

const validationSchema = Yup.object({
  clienteId: Yup.string().required('Cliente é obrigatório'),
  veiculoId: Yup.string().required('Veículo é obrigatório'),
  dataEmissao: Yup.date(),
  dataValidade: Yup.date(),
  descricaoProblema: Yup.string(),
  observacoes: Yup.string().max(1000, 'Máximo de 1000 caracteres'),
  desconto: Yup.number().min(0, 'Desconto não pode ser negativo'),
  itens: Yup.array().of(itemSchema).min(1, 'Adicione pelo menos um item'),
});

const emptyItem = () => ({
  tipo: '',
  descricao: '',
  quantidade: 1,
  valorUnitario: 0,
});

const OrcamentoForm = ({ orcamento: propOrcamento, onSave, onCancel }) => {
  const { showSuccess, showError } = useNotification();

  const initialValues = {
    clienteId: propOrcamento?.clienteId || '',
    veiculoId: propOrcamento?.veiculoId || '',
    dataEmissao: propOrcamento?.dataEmissao || '',
    dataValidade: propOrcamento?.dataValidade || '',
    descricaoProblema: propOrcamento?.descricaoProblema || '',
    observacoes: propOrcamento?.observacoes || '',
    desconto: propOrcamento?.desconto || 0,
    itens:
      propOrcamento?.itens && Array.isArray(propOrcamento.itens) && propOrcamento.itens.length
        ? propOrcamento.itens
        : [emptyItem()],
  };

  const isEditing = !!(propOrcamento && propOrcamento.id);

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = { ...values };

    try {
      if (onSave && typeof onSave === 'function') {
        await onSave(payload);
        showSuccess(SUCCESS_MESSAGES.SAVE_QUOTE);
      } else {
        if (isEditing) {
          await orcamentoService.update(propOrcamento.id, payload);
          showSuccess(SUCCESS_MESSAGES.SAVE_QUOTE);
        } else {
          await orcamentoService.create(payload);
          showSuccess(SUCCESS_MESSAGES.SAVE_QUOTE);
        }
      }
    } catch (err) {
      console.error('Erro ao salvar orçamento', err);
      showError(ERROR_MESSAGES.SAVE_QUOTE);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <FormContainer
      title={isEditing ? 'Editar Orçamento' : 'Novo Orçamento'}
      subtitle={
        isEditing
          ? 'Atualize as informações do orçamento'
          : 'Crie um orçamento para um cliente e veículo'
      }
      maxWidth={1000}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <FormSection
              title="Informações Gerais"
              subtitle="Cliente, veículo e datas do orçamento"
            >
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <FormField
                    name="clienteId"
                    label="ID do Cliente"
                    placeholder="Informe o ID do cliente"
                    required
                    startIcon={<PersonIcon />}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormField
                    name="veiculoId"
                    label="ID do Veículo"
                    placeholder="Informe o ID do veículo"
                    required
                    startIcon={<DirectionsCarIcon />}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormField
                    name="dataEmissao"
                    label="Data de Emissão"
                    type="date"
                    startIcon={<CalendarTodayIcon />}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormField
                    name="dataValidade"
                    label="Data de Validade"
                    type="date"
                    startIcon={<CalendarTodayIcon />}
                    InputLabelProps={{ shrink: true }}
                    helperText="Data limite de validade do orçamento"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormField
                    name="descricaoProblema"
                    label="Descrição do Problema"
                    placeholder="Descreva o problema relatado pelo cliente"
                    multiline
                    rows={3}
                    startIcon={<DescriptionIcon />}
                  />
                </Grid>
              </Grid>
            </FormSection>

            <FormSection
              title="Itens do Orçamento"
              subtitle="Serviços e peças incluídos no orçamento"
            >
              <FieldArray name="itens">
                {({ push, remove }) => (
                  <>
                    {values.itens.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          mb: 3,
                          p: 2.5,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          background: 'rgba(0,0,0,0.02)',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight={600}>
                            Item {index + 1}
                          </Typography>
                          {values.itens.length > 1 && (
                            <IconButton
                              color="error"
                              onClick={() => remove(index)}
                              size="small"
                              aria-label={`Remover item ${index + 1}`}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <FormField
                              name={`itens.${index}.tipo`}
                              label="Tipo"
                              placeholder="Serviço/Peça"
                            />
                          </Grid>

                          <Grid item xs={12} md={5}>
                            <FormField
                              name={`itens.${index}.descricao`}
                              label="Descrição"
                              placeholder="Descreva o item"
                            />
                          </Grid>

                          <Grid item xs={12} md={2}>
                            <FormField
                              name={`itens.${index}.quantidade`}
                              label="Quantidade"
                              type="number"
                              inputProps={{ min: 1 }}
                            />
                          </Grid>

                          <Grid item xs={12} md={2}>
                            <FormField
                              name={`itens.${index}.valorUnitario`}
                              label="Valor (R$)"
                              type="number"
                              inputProps={{ min: 0, step: '0.01' }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    ))}

                    <Button
                      variant="outlined"
                      startIcon={<AddCircleIcon />}
                      onClick={() => push(emptyItem())}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        borderWidth: 2,
                        '&:hover': {
                          borderWidth: 2,
                        },
                      }}
                    >
                      Adicionar Item
                    </Button>
                  </>
                )}
              </FieldArray>
            </FormSection>

            <FormSection
              title="Informações Adicionais"
              subtitle="Desconto e observações"
              divider={false}
            >
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={4}>
                  <FormField
                    name="desconto"
                    label="Desconto (R$)"
                    type="number"
                    startIcon={<AttachMoneyIcon />}
                    inputProps={{ min: 0, step: '0.01' }}
                    helperText="Valor do desconto aplicado"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormField
                    name="observacoes"
                    label="Observações"
                    placeholder="Informações adicionais sobre o orçamento"
                    multiline
                    rows={4}
                    startIcon={<NotesIcon />}
                    inputProps={{ maxLength: 1000 }}
                  />
                </Grid>
              </Grid>
            </FormSection>

            <FormActions
              onCancel={handleCancel}
              loading={isSubmitting}
              submitLabel={isEditing ? 'Atualizar Orçamento' : 'Criar Orçamento'}
            />
          </form>
        )}
      </Formik>
    </FormContainer>
  );
};

OrcamentoForm.propTypes = {
  orcamento: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    clienteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    veiculoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dataEmissao: PropTypes.string,
    dataValidade: PropTypes.string,
    descricaoProblema: PropTypes.string,
    observacoes: PropTypes.string,
    desconto: PropTypes.number,
    itens: PropTypes.arrayOf(
      PropTypes.shape({
        tipo: PropTypes.string,
        descricao: PropTypes.string,
        quantidade: PropTypes.number,
        valorUnitario: PropTypes.number,
      })
    ),
  }),
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};

export default OrcamentoForm;
