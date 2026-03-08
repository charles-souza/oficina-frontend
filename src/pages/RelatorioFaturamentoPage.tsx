import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
  Grid,
  Alert,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  PageContainer,
  PageHeader,
  ContentCard,
} from '../components/common';
import { useNotification } from '../contexts/NotificationContext';
import ClienteAutocomplete from '../components/common/ClienteAutocompleteStandalone';
import VeiculoAutocomplete from '../components/common/VeiculoAutocompleteStandalone';
import api from '../services/api';

const RelatorioFaturamentoPage: React.FC = () => {
  const { showError, showSuccess } = useNotification();
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [clienteId, setClienteId] = useState<string>('');
  const [veiculoId, setVeiculoId] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<'periodo' | 'cliente' | 'veiculo'>('periodo');
  const [generating, setGenerating] = useState(false);

  const handleLimparFiltros = () => {
    setDataInicio('');
    setDataFim('');
    setClienteId('');
    setVeiculoId('');
    setFiltroTipo('periodo');
  };

  const handleGerarRelatorio = async () => {
    // Validar filtros
    if (filtroTipo === 'periodo' && !dataInicio && !dataFim) {
      showError('Selecione pelo menos uma data para o filtro por período');
      return;
    }

    if (filtroTipo === 'cliente' && !clienteId) {
      showError('Selecione um cliente');
      return;
    }

    if (filtroTipo === 'veiculo' && !veiculoId) {
      showError('Selecione um veículo');
      return;
    }

    setGenerating(true);

    try {
      // Preparar parâmetros
      const params: any = {};

      if (filtroTipo === 'periodo') {
        if (dataInicio) {
          params.dataInicio = dataInicio;
        }
        if (dataFim) {
          params.dataFim = dataFim;
        }
      } else if (filtroTipo === 'cliente' && clienteId) {
        params.clienteId = clienteId;
      } else if (filtroTipo === 'veiculo' && veiculoId) {
        params.veiculoId = veiculoId;
      }

      // Fazer requisição para gerar PDF
      const response = await api.get('/faturamento/relatorio/pdf', {
        params,
        responseType: 'blob',
      });

      // Criar URL temporária para o blob
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = window.URL.createObjectURL(pdfBlob);

      // Abrir em nova aba
      window.open(pdfUrl, '_blank');

      // Limpar URL após um tempo
      setTimeout(() => {
        window.URL.revokeObjectURL(pdfUrl);
      }, 100);

      showSuccess('Relatório gerado com sucesso!');
    } catch (err: any) {
      console.error('Erro ao gerar relatório:', err);
      showError(err.response?.data?.message || 'Erro ao gerar relatório de faturamento');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Relatório de Faturamento"
        subtitle="Gere relatórios personalizados de faturamento"
      />

      <ContentCard>
        <Box sx={{ p: 3 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Selecione o tipo de filtro e preencha os campos necessários para gerar o relatório em PDF.
          </Alert>

          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
              Filtros de Geração
            </Typography>

            {/* Tipo de Filtro */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Tipo de Filtro"
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value as any)}
                  helperText="Selecione como deseja filtrar o relatório"
                >
                  <MenuItem value="periodo">Por Período</MenuItem>
                  <MenuItem value="cliente">Por Cliente</MenuItem>
                  <MenuItem value="veiculo">Por Veículo</MenuItem>
                </TextField>
              </Grid>

              {/* Filtro por Período */}
              {filtroTipo === 'periodo' && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Data Início"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      helperText="Deixe em branco para sem limite inicial"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Data Fim"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      helperText="Deixe em branco para data atual"
                    />
                  </Grid>
                </>
              )}

              {/* Filtro por Cliente */}
              {filtroTipo === 'cliente' && (
                <Grid item xs={12}>
                  <ClienteAutocomplete
                    value={clienteId}
                    onChange={(value) => setClienteId(value || '')}
                    label="Cliente"
                    helperText="Selecione o cliente para filtrar o relatório"
                  />
                </Grid>
              )}

              {/* Filtro por Veículo */}
              {filtroTipo === 'veiculo' && (
                <Grid item xs={12}>
                  <VeiculoAutocomplete
                    value={veiculoId}
                    onChange={(value) => setVeiculoId(value || '')}
                    label="Veículo"
                    helperText="Selecione o veículo para filtrar o relatório"
                  />
                </Grid>
              )}

              {/* Botões de Ação */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleLimparFiltros}
                  >
                    Limpar Filtros
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={handleGerarRelatorio}
                    disabled={generating}
                  >
                    {generating ? 'Gerando...' : 'Gerar Relatório'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Informações Adicionais */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary', mb: 2 }}>
              Informações sobre o Relatório
            </Typography>

            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="body2" paragraph>
                <strong>Filtro por Período:</strong> Gera relatório com todos os recibos emitidos
                no intervalo de datas especificado.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Filtro por Cliente:</strong> Gera relatório com todos os recibos de um
                cliente específico, independente do período.
              </Typography>
              <Typography variant="body2">
                <strong>Filtro por Veículo:</strong> Gera relatório com todos os recibos
                relacionados a um veículo específico.
              </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, bgcolor: 'info.50', borderRadius: 2, mt: 2 }}>
              <Typography variant="body2" color="info.main">
                <strong>O relatório incluirá:</strong>
              </Typography>
              <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                <Typography component="li" variant="body2" color="info.main">
                  Resumo geral com total de recibos e valor total faturado
                </Typography>
                <Typography component="li" variant="body2" color="info.main">
                  Lista detalhada de todos os recibos no período/filtro
                </Typography>
                <Typography component="li" variant="body2" color="info.main">
                  Faturamento agrupado por forma de pagamento
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </ContentCard>
    </PageContainer>
  );
};

export default RelatorioFaturamentoPage;
