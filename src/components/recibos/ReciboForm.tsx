import React from 'react';
import PropTypes from 'prop-types';
import { Grid, MenuItem } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaymentIcon from '@mui/icons-material/Payment';
import DescriptionIcon from '@mui/icons-material/Description';
import NotesIcon from '@mui/icons-material/Notes';

import FormContainer from '../common/FormContainer';
import FormField from '../common/FormField';
import FormSection from '../common/FormSection';
import FormActions from '../common/FormActions';
import { reciboService } from '../../services/reciboService';
import { useNotification } from '../../contexts/NotificationContext';

const FORMAS_PAGAMENTO = [
  'Dinheiro',
  'Cartão de Crédito',
  'Cartão de Débito',
  'PIX',
  'Transferência Bancária',
  'Boleto',
];

const validationSchema = Yup.object({
  clienteId: Yup.string().required('Cliente é obrigatório'),
  orcamentoId: Yup.string(),
  dataEmissao: Yup.date().required('Data de emissão é obrigatória'),
  valorPago: Yup.number()
    .min(0.01, 'Valor pago deve ser maior que zero')
    .required('Valor pago é obrigatório'),
  formaPagamento: Yup.string().required('Forma de pagamento é obrigatória'),
  descricao: Yup.string().max(500, 'Máximo de 500 caracteres'),
  observacoes: Yup.string().max(1000, 'Máximo de 1000 caracteres'),
});

const ReciboForm = ({ recibo, onSave, onCancel }) => {
  const { showSuccess, showError } = useNotification();
  const isEditing = !!(recibo && recibo.id);

  const initialValues = {
    orcamentoId: recibo?.orcamentoId || '',
    clienteId: recibo?.clienteId || '',
    dataEmissao: recibo?.dataEmissao || new Date().toISOString().split('T')[0],
    valorPago: recibo?.valorPago || '',
    formaPagamento: recibo?.formaPagamento || '',
    descricao: recibo?.descricao || '',
    observacoes: recibo?.observacoes || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      orcamentoId: values.orcamentoId || null,
      clienteId: parseInt(values.clienteId, 10),
      dataEmissao: values.dataEmissao,
      valorPago: parseFloat(values.valorPago),
      formaPagamento: values.formaPagamento,
      descricao: values.descricao.trim() || null,
      observacoes: values.observacoes.trim() || null,
    };

    try {
      if (isEditing) {
        await reciboService.update(recibo.id, payload);
        showSuccess('Recibo atualizado com sucesso!');
      } else {
        await reciboService.create(payload);
        showSuccess('Recibo criado com sucesso!');
      }
      if (onSave) onSave(payload);
    } catch (err) {
      console.error('Erro ao salvar recibo:', err);
      showError(err.message || 'Erro ao salvar recibo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormContainer
      title={isEditing ? 'Editar Recibo' : 'Novo Recibo'}
      subtitle={
        isEditing
          ? 'Atualize as informações do recibo'
          : 'Gere um recibo de pagamento para o cliente'
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
              title="Identificação"
              subtitle="Cliente e orçamento relacionado"
            >
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <FormField
                    name="clienteId"
                    label="ID do Cliente"
                    type="number"
                    placeholder="Informe o ID do cliente"
                    required
                    startIcon={<PersonIcon />}
                    helperText="Cliente que realizou o pagamento"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormField
                    name="orcamentoId"
                    label="ID do Orçamento"
                    type="number"
                    placeholder="Opcional"
                    startIcon={<ReceiptIcon />}
                    helperText="Orçamento relacionado (se houver)"
                  />
                </Grid>
              </Grid>
            </FormSection>

            <FormSection
              title="Detalhes do Pagamento"
              subtitle="Data, valor e forma de pagamento"
            >
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={4}>
                  <FormField
                    name="dataEmissao"
                    label="Data de Emissão"
                    type="date"
                    required
                    startIcon={<CalendarTodayIcon />}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormField
                    name="valorPago"
                    label="Valor Pago (R$)"
                    type="number"
                    placeholder="0.00"
                    required
                    startIcon={<AttachMoneyIcon />}
                    inputProps={{ min: 0, step: '0.01' }}
                    helperText="Valor total pago pelo cliente"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormField
                    name="formaPagamento"
                    label="Forma de Pagamento"
                    select
                    required
                    startIcon={<PaymentIcon />}
                    helperText="Método utilizado para pagamento"
                  >
                    {FORMAS_PAGAMENTO.map((forma) => (
                      <MenuItem key={forma} value={forma}>
                        {forma}
                      </MenuItem>
                    ))}
                  </FormField>
                </Grid>
              </Grid>
            </FormSection>

            <FormSection
              title="Informações Adicionais"
              subtitle="Descrição e observações do recibo"
              divider={false}
            >
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <FormField
                    name="descricao"
                    label="Descrição"
                    placeholder="Breve descrição do que foi pago"
                    multiline
                    rows={2}
                    startIcon={<DescriptionIcon />}
                    inputProps={{ maxLength: 500 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormField
                    name="observacoes"
                    label="Observações"
                    placeholder="Observações adicionais sobre o pagamento"
                    multiline
                    rows={3}
                    startIcon={<NotesIcon />}
                    inputProps={{ maxLength: 1000 }}
                  />
                </Grid>
              </Grid>
            </FormSection>

            <FormActions
              onCancel={onCancel}
              loading={isSubmitting}
              submitLabel={isEditing ? 'Atualizar Recibo' : 'Gerar Recibo'}
            />
          </form>
        )}
      </Formik>
    </FormContainer>
  );
};

ReciboForm.propTypes = {
  recibo: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    orcamentoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    clienteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dataEmissao: PropTypes.string,
    valorPago: PropTypes.number,
    formaPagamento: PropTypes.string,
    descricao: PropTypes.string,
    observacoes: PropTypes.string,
  }),
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};

export default ReciboForm;
