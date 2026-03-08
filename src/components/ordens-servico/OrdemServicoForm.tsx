import React from 'react';
import PropTypes from 'prop-types';
import { Button, Box, IconButton, Typography } from '@mui/material';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import NotesIcon from '@mui/icons-material/Notes';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BuildIcon from '@mui/icons-material/Build';

import FormField from '../common/FormField';
import FormSection from '../common/FormSection';
import FormActions from '../common/FormActions';
import ClienteAutocomplete from '../common/ClienteAutocomplete';
import VeiculoAutocomplete from '../common/VeiculoAutocomplete';
import { OrdemServico, OrdemServicoRequest } from '../../types/api';
import { useNotification } from '../../contexts/NotificationContext';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants';

const itemSchema = Yup.object({
  tipo: Yup.string().required('Tipo é obrigatório'),
  descricao: Yup.string().required('Descrição é obrigatória'),
  quantidade: Yup.number().min(1, 'Quantidade mínima é 1').required('Quantidade é obrigatória'),
  valorUnitario: Yup.number().min(0, 'Valor deve ser positivo').required('Valor é obrigatório'),
});

const validationSchema = Yup.object({
  clienteId: Yup.string().required('Cliente é obrigatório'),
  veiculoId: Yup.string().required('Veículo é obrigatório'),
  dataAbertura: Yup.date().required('Data de abertura é obrigatória'),
  descricao: Yup.string().required('Descrição é obrigatória'),
  observacoes: Yup.string().max(1000, 'Máximo de 1000 caracteres'),
  desconto: Yup.number().min(0, 'Desconto não pode ser negativo'),
  itens: Yup.array().of(itemSchema).min(1, 'Adicione pelo menos um item'),
});

const emptyItem = () => ({
  tipo: 'SERVICO',
  descricao: '',
  quantidade: 1,
  valorUnitario: 0,
});

interface OrdemServicoFormProps {
  ordem?: OrdemServico;
  onSave: (values: OrdemServicoRequest) => void;
  onCancel: () => void;
}

const OrdemServicoForm: React.FC<OrdemServicoFormProps> = ({ ordem, onSave, onCancel }) => {
  const { showSuccess, showError } = useNotification();

  const initialValues: OrdemServicoRequest = {
    clienteId: ordem?.clienteId || '',
    veiculoId: ordem?.veiculoId || '',
    dataAbertura: ordem?.dataAbertura || new Date().toISOString().split('T')[0],
    dataConclusao: ordem?.dataConclusao || undefined,
    dataEntrega: ordem?.dataEntrega || undefined,
    descricao: ordem?.descricao || '',
    observacoes: ordem?.observacoes || '',
    desconto: ordem?.desconto || 0,
    itens:
      ordem?.itens && Array.isArray(ordem.itens) && ordem.itens.length
        ? ordem.itens
        : [emptyItem()],
  };

  const isEditing = !!(ordem && ordem.id);

  const handleSubmit = async (values: OrdemServicoRequest, { setSubmitting }: any) => {
    const payload = { ...values };

    // Calcular valorTotal de cada item
    if (payload.itens && Array.isArray(payload.itens)) {
      payload.itens = payload.itens.map((item) => ({
        ...item,
        valorTotal: (item.quantidade || 0) * (item.valorUnitario || 0),
      }));
    }

    // Calcular valorTotal da ordem
    const subtotal = (payload.itens || []).reduce((sum, item) => {
      return sum + (item.valorTotal || 0);
    }, 0);
    payload.valorTotal = subtotal - (payload.desconto || 0);

    console.log('Salvando ordem de serviço:', {
      isEditing,
      ordemId: ordem?.id,
      payload,
    });

    try {
      if (onSave && typeof onSave === 'function') {
        await onSave(payload);
      }
    } catch (err) {
      console.error('Erro ao salvar ordem de serviço', err);
      showError(ERROR_MESSAGES.SAVE_QUOTE);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const calcularSubtotal = (itens: any[]) => {
    return itens.reduce((sum, item) => {
      return sum + (item.quantidade || 0) * (item.valorUnitario || 0);
    }, 0);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormSection
              title="Informações Gerais"
              subtitle="Cliente, veículo e datas da ordem de serviço"
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
                <Box sx={{ flex: '1 1 calc(50% - 10px)', minWidth: { xs: '100%', md: 'calc(50% - 10px)' } }}>
                  <ClienteAutocomplete name="clienteId" label="Cliente" required />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 10px)', minWidth: { xs: '100%', md: 'calc(50% - 10px)' } }}>
                  <VeiculoAutocomplete
                    name="veiculoId"
                    label="Veículo"
                    required
                    clienteId={values.clienteId}
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(33.333% - 14px)', minWidth: { xs: '100%', md: 'calc(33.333% - 14px)' } }}>
                  <FormField
                    name="dataAbertura"
                    label="Data de Abertura"
                    type="date"
                    startIcon={<CalendarTodayIcon />}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(33.333% - 14px)', minWidth: { xs: '100%', md: 'calc(33.333% - 14px)' } }}>
                  <FormField
                    name="dataConclusao"
                    label="Data de Conclusão"
                    type="date"
                    startIcon={<CalendarTodayIcon />}
                    InputLabelProps={{ shrink: true }}
                    helperText="Data prevista para conclusão"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(33.333% - 14px)', minWidth: { xs: '100%', md: 'calc(33.333% - 14px)' } }}>
                  <FormField
                    name="dataEntrega"
                    label="Data de Entrega"
                    type="date"
                    startIcon={<CalendarTodayIcon />}
                    InputLabelProps={{ shrink: true }}
                    helperText="Data de entrega ao cliente"
                  />
                </Box>

                <Box sx={{ flex: '1 1 100%' }}>
                  <FormField
                    name="descricao"
                    label="Descrição do Problema"
                    placeholder="Descreva o problema relatado pelo cliente"
                    multiline
                    rows={3}
                    startIcon={<DescriptionIcon />}
                    required
                  />
                </Box>
              </Box>
            </FormSection>

            <FormSection
              title="Itens da Ordem de Serviço"
              subtitle="Serviços e peças incluídos na ordem"
            >
              <FieldArray name="itens">
                {({ push, remove }) => (
                  <>
                    {values.itens.map((item: any, index: number) => (
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

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                          <Box sx={{ flex: '1 1 calc(25% - 12px)', minWidth: { xs: '100%', md: 'calc(25% - 12px)' } }}>
                            <FormField
                              name={`itens.${index}.tipo`}
                              label="Tipo"
                              select
                              startIcon={<BuildIcon />}
                              required
                            >
                              <option value="SERVICO">Serviço</option>
                              <option value="PECA">Peça</option>
                            </FormField>
                          </Box>

                          <Box sx={{ flex: '1 1 calc(40% - 12px)', minWidth: { xs: '100%', md: 'calc(40% - 12px)' } }}>
                            <FormField
                              name={`itens.${index}.descricao`}
                              label="Descrição"
                              placeholder="Descreva o item"
                              required
                            />
                          </Box>

                          <Box
                            sx={{ flex: '1 1 calc(17.5% - 12px)', minWidth: { xs: 'calc(50% - 8px)', md: 'calc(17.5% - 12px)' } }}
                          >
                            <FormField
                              name={`itens.${index}.quantidade`}
                              label="Quantidade"
                              type="number"
                              inputProps={{ min: 1 }}
                              required
                            />
                          </Box>

                          <Box
                            sx={{ flex: '1 1 calc(17.5% - 12px)', minWidth: { xs: 'calc(50% - 8px)', md: 'calc(17.5% - 12px)' } }}
                          >
                            <FormField
                              name={`itens.${index}.valorUnitario`}
                              label="Valor (R$)"
                              type="number"
                              inputProps={{ min: 0, step: '0.01' }}
                              required
                            />
                          </Box>
                        </Box>

                        <Box sx={{ mt: 2, textAlign: 'right' }}>
                          <Typography variant="body2" color="text.secondary">
                            Subtotal do item:{' '}
                            <strong>
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              }).format((item.quantidade || 0) * (item.valorUnitario || 0))}
                            </strong>
                          </Typography>
                        </Box>
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
              subtitle="Desconto, observações e valor total"
              divider={false}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
                <Box sx={{ flex: '1 1 calc(50% - 10px)', minWidth: { xs: '100%', md: 'calc(50% - 10px)' } }}>
                  <FormField
                    name="desconto"
                    label="Desconto (R$)"
                    type="number"
                    startIcon={<AttachMoneyIcon />}
                    inputProps={{ min: 0, step: '0.01' }}
                    helperText="Valor do desconto aplicado"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 10px)', minWidth: { xs: '100%', md: 'calc(50% - 10px)' } }}>
                  <Box
                    sx={{
                      p: 2.5,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    }}
                  >
                    <Box sx={{ textAlign: 'center', color: 'white' }}>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Valor Total
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(calcularSubtotal(values.itens) - (values.desconto || 0))}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ flex: '1 1 100%' }}>
                  <FormField
                    name="observacoes"
                    label="Observações"
                    placeholder="Informações adicionais sobre a ordem de serviço"
                    multiline
                    rows={4}
                    startIcon={<NotesIcon />}
                    inputProps={{ maxLength: 1000 }}
                  />
                </Box>
              </Box>
            </FormSection>

            <FormActions
              onCancel={handleCancel}
              loading={isSubmitting}
              submitLabel={isEditing ? 'Atualizar Ordem' : 'Criar Ordem'}
            />
          </Box>
        </form>
      )}
    </Formik>
  );
};

OrdemServicoForm.propTypes = {
  ordem: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default OrdemServicoForm;
