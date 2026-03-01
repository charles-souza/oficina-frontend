import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import {
  Grid,
  Button,
  Box,
  Typography,
  Paper,
  IconButton,
  MenuItem,
  Divider,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import FormField from '../common/FormField';
import {
  OrdemServicoRequest,
  OrdemServicoStatus,
  ItemTipo,
  ItemOrdemServico,
  Cliente,
  Veiculo,
} from '../../types/api';
import clienteService from '../../services/clienteService';
import veiculoService from '../../services/veiculoService';

interface OrdemServicoFormProps {
  initialValues?: OrdemServicoRequest;
  onSubmit: (values: OrdemServicoRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

const validationSchema = Yup.object({
  clienteId: Yup.number().required('Cliente é obrigatório').positive(),
  veiculoId: Yup.number().required('Veículo é obrigatório').positive(),
  dataAbertura: Yup.string().required('Data de abertura é obrigatória'),
  descricao: Yup.string().required('Descrição é obrigatória'),
  desconto: Yup.number().min(0, 'Desconto não pode ser negativo').max(100, 'Desconto máximo 100%'),
  itens: Yup.array()
    .of(
      Yup.object({
        tipo: Yup.string().required('Tipo é obrigatório'),
        descricao: Yup.string().required('Descrição é obrigatória'),
        quantidade: Yup.number().required('Quantidade é obrigatória').positive(),
        valorUnitario: Yup.number().required('Valor unitário é obrigatório').positive(),
      })
    )
    .min(1, 'Adicione pelo menos um item'),
});

const OrdemServicoForm: React.FC<OrdemServicoFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingVeiculos, setLoadingVeiculos] = useState(false);

  const defaultValues: OrdemServicoRequest = initialValues || {
    clienteId: 0,
    veiculoId: 0,
    dataAbertura: new Date().toISOString().split('T')[0],
    descricao: '',
    observacoes: '',
    desconto: 0,
    itens: [
      {
        tipo: ItemTipo.SERVICO,
        descricao: '',
        quantidade: 1,
        valorUnitario: 0,
      },
    ],
  };

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    setLoadingClientes(true);
    try {
      const response = await clienteService.getAll(0, 100);
      setClientes(response.content);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoadingClientes(false);
    }
  };

  const loadVeiculosByCliente = async (clienteId: number) => {
    if (!clienteId) return;
    setLoadingVeiculos(true);
    try {
      const data = await veiculoService.getAll(0, 100);
      const veiculosDoCliente = data.content.filter((v) => v.clienteId === clienteId);
      setVeiculos(veiculosDoCliente);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
    } finally {
      setLoadingVeiculos(false);
    }
  };

  const calcularTotal = (itens: ItemOrdemServico[], desconto: number = 0) => {
    const subtotal = itens.reduce(
      (acc, item) => acc + item.quantidade * item.valorUnitario,
      0
    );
    return subtotal - (subtotal * desconto) / 100;
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form>
          <Grid container spacing={3}>
            {/* Seção Cliente e Veículo */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informações Básicas
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={touched.clienteId && Boolean(errors.clienteId)}>
                <InputLabel>Cliente *</InputLabel>
                <Select
                  value={values.clienteId || ''}
                  onChange={(e) => {
                    const clienteId = Number(e.target.value);
                    setFieldValue('clienteId', clienteId);
                    setFieldValue('veiculoId', 0);
                    loadVeiculosByCliente(clienteId);
                  }}
                  label="Cliente *"
                  disabled={loadingClientes}
                >
                  <MenuItem value="">
                    <em>Selecione um cliente</em>
                  </MenuItem>
                  {clientes.map((cliente) => (
                    <MenuItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </MenuItem>
                  ))}
                </Select>
                {touched.clienteId && errors.clienteId && (
                  <FormHelperText>{errors.clienteId}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={touched.veiculoId && Boolean(errors.veiculoId)}>
                <InputLabel>Veículo *</InputLabel>
                <Select
                  value={values.veiculoId || ''}
                  onChange={(e) => setFieldValue('veiculoId', Number(e.target.value))}
                  label="Veículo *"
                  disabled={!values.clienteId || loadingVeiculos}
                >
                  <MenuItem value="">
                    <em>Selecione um veículo</em>
                  </MenuItem>
                  {veiculos.map((veiculo) => (
                    <MenuItem key={veiculo.id} value={veiculo.id}>
                      {veiculo.placa} - {veiculo.marca} {veiculo.modelo}
                    </MenuItem>
                  ))}
                </Select>
                {touched.veiculoId && errors.veiculoId && (
                  <FormHelperText>{errors.veiculoId}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField
                name="dataAbertura"
                label="Data de Abertura"
                type="date"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField
                name="dataConclusao"
                label="Data de Conclusão"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormField
                name="descricao"
                label="Descrição do Problema"
                multiline
                rows={3}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormField
                name="observacoes"
                label="Observações"
                multiline
                rows={2}
              />
            </Grid>

            {/* Seção Itens */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Itens da Ordem</Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <FieldArray name="itens">
                {({ push, remove }) => (
                  <>
                    {values.itens.map((item, index) => (
                      <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: 'grey.50' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Tipo *</InputLabel>
                              <Select
                                value={item.tipo}
                                onChange={(e) =>
                                  setFieldValue(`itens.${index}.tipo`, e.target.value)
                                }
                                label="Tipo *"
                              >
                                <MenuItem value={ItemTipo.SERVICO}>Serviço</MenuItem>
                                <MenuItem value={ItemTipo.PECA}>Peça</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} sm={6} md={4}>
                            <FormField
                              name={`itens.${index}.descricao`}
                              label="Descrição"
                              size="small"
                              required
                            />
                          </Grid>

                          <Grid item xs={6} sm={4} md={2}>
                            <FormField
                              name={`itens.${index}.quantidade`}
                              label="Qtd"
                              type="number"
                              size="small"
                              required
                            />
                          </Grid>

                          <Grid item xs={6} sm={4} md={2}>
                            <FormField
                              name={`itens.${index}.valorUnitario`}
                              label="Valor Unit."
                              type="number"
                              size="small"
                              required
                            />
                          </Grid>

                          <Grid item xs={12} sm={4} md={2}>
                            <Box display="flex" alignItems="center" height="100%">
                              <Typography variant="body2" mr={2}>
                                Total: R${' '}
                                {(item.quantidade * item.valorUnitario).toFixed(2)}
                              </Typography>
                              {values.itens.length > 1 && (
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => remove(index)}
                                >
                                  <Delete />
                                </IconButton>
                              )}
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}

                    <Button
                      startIcon={<Add />}
                      variant="outlined"
                      onClick={() =>
                        push({
                          tipo: ItemTipo.SERVICO,
                          descricao: '',
                          quantidade: 1,
                          valorUnitario: 0,
                        })
                      }
                      sx={{ mb: 2 }}
                    >
                      Adicionar Item
                    </Button>
                  </>
                )}
              </FieldArray>
            </Grid>

            {/* Seção Totais */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField
                name="desconto"
                label="Desconto (%)"
                type="number"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6">
                  Valor Total: R${' '}
                  {calcularTotal(values.itens, values.desconto).toFixed(2)}
                </Typography>
              </Box>
            </Grid>

            {/* Botões */}
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default OrdemServicoForm;
