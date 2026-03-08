import React from 'react';
import PropTypes from 'prop-types';
import { Box, MenuItem } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaymentIcon from '@mui/icons-material/Payment';
import DescriptionIcon from '@mui/icons-material/Description';
import NotesIcon from '@mui/icons-material/Notes';

import FormField from '../common/FormField';
import FormSection from '../common/FormSection';
import FormActions from '../common/FormActions';
import ClienteAutocomplete from '../common/ClienteAutocomplete';
import { reciboService } from '../../services/reciboService';
import { useNotification } from '../../contexts/NotificationContext';

const FORMAS_PAGAMENTO = [
  { value: 'DINHEIRO', label: 'Dinheiro' },
  { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
  { value: 'CARTAO_DEBITO', label: 'Cartão de Débito' },
  { value: 'PIX', label: 'PIX' },
  { value: 'TRANSFERENCIA', label: 'Transferência Bancária' },
  { value: 'CHEQUE', label: 'Cheque' },
  { value: 'BOLETO', label: 'Boleto' },
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
      clienteId: values.clienteId,
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
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
            <FormSection title="Identificação" subtitle="Cliente que realizou o pagamento">
              <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <ClienteAutocomplete name="clienteId" label="Cliente" required />
                </Box>
              </Box>
            </FormSection>

            <FormSection title="Detalhes do Pagamento" subtitle="Data, valor e forma de pagamento">
              <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 250px', minWidth: '200px' }}>
                  <FormField
                    name="dataEmissao"
                    label="Data de Emissão"
                    type="date"
                    required
                    startIcon={<CalendarTodayIcon />}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 250px', minWidth: '200px' }}>
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
                </Box>

                <Box sx={{ flex: '1 1 250px', minWidth: '200px' }}>
                  <FormField
                    name="formaPagamento"
                    label="Forma de Pagamento"
                    select
                    required
                    startIcon={<PaymentIcon />}
                    helperText="Método utilizado para pagamento"
                  >
                    {FORMAS_PAGAMENTO.map((forma) => (
                      <MenuItem key={forma.value} value={forma.value}>
                        {forma.label}
                      </MenuItem>
                    ))}
                  </FormField>
                </Box>
              </Box>
            </FormSection>

            <FormSection
              title="Informações Adicionais"
              subtitle="Descrição e observações do recibo"
              divider={false}
            >
              <Box sx={{ display: 'flex', gap: 2.5, flexDirection: 'column' }}>
                <FormField
                  name="descricao"
                  label="Descrição"
                  placeholder="Breve descrição do que foi pago"
                  multiline
                  rows={2}
                  startIcon={<DescriptionIcon />}
                  inputProps={{ maxLength: 500 }}
                />

                <FormField
                  name="observacoes"
                  label="Observações"
                  placeholder="Observações adicionais sobre o pagamento"
                  multiline
                  rows={3}
                  startIcon={<NotesIcon />}
                  inputProps={{ maxLength: 1000 }}
                />
              </Box>
            </FormSection>

          <FormActions
            onCancel={onCancel}
            loading={isSubmitting}
            submitLabel={isEditing ? 'Atualizar Recibo' : 'Gerar Recibo'}
          />
        </form>
      )}
    </Formik>
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
