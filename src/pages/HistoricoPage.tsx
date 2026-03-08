import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Paper,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import HistoricoTimeline from '../components/historico/HistoricoTimeline';
import { PageContainer, PageHeader, ContentCard, LoadingState } from '../components/common';
import { useNotification } from '../contexts/NotificationContext';
import { historicoService } from '../services/historicoService';
import { veiculoService } from '../services/veiculoService';
import { HistoricoServico, Veiculo } from '../types/api';
import { usePageTitle } from '../hooks/usePageTitle';

const HistoricoPage: React.FC = () => {
  usePageTitle('Histórico');

  const [historicos, setHistoricos] = useState<HistoricoServico[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingVeiculos, setLoadingVeiculos] = useState(false);
  const [selectedVeiculo, setSelectedVeiculo] = useState<number | ''>('');

  const { showNotification } = useNotification();

  useEffect(() => {
    loadVeiculos();
  }, []);

  useEffect(() => {
    if (selectedVeiculo) {
      loadHistoricosByVeiculo(selectedVeiculo as number);
    } else {
      setHistoricos([]);
    }
  }, [selectedVeiculo]);

  const loadVeiculos = async () => {
    setLoadingVeiculos(true);
    try {
      const response = await veiculoService.getAll(0, 100);
      setVeiculos(response.content);
    } catch (error) {
      showNotification('Erro ao carregar veículos', 'error');
    } finally {
      setLoadingVeiculos(false);
    }
  };

  const loadHistoricosByVeiculo = async (veiculoId: number) => {
    setLoading(true);
    try {
      const data = await historicoService.getByVeiculo(veiculoId);
      setHistoricos(data);
    } catch (error) {
      showNotification('Erro ao carregar histórico do veículo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (selectedVeiculo) {
      loadHistoricosByVeiculo(selectedVeiculo as number);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Histórico de Serviços"
        subtitle="Visualize todo o histórico de eventos e alterações"
      />

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <FormControl sx={{ minWidth: { xs: '100%', sm: 300 } }} size="small">
            <InputLabel>Filtrar por Veículo</InputLabel>
            <Select
              value={selectedVeiculo}
              onChange={(e) => setSelectedVeiculo(e.target.value as number | '')}
              label="Filtrar por Veículo"
              disabled={loadingVeiculos}
            >
              <MenuItem value="">
                <em>Todos os veículos</em>
              </MenuItem>
              {veiculos && veiculos.length > 0 ? (
                veiculos.map((veiculo) => (
                  <MenuItem key={veiculo.id} value={veiculo.id}>
                    {veiculo.placa} - {veiculo.marca} {veiculo.modelo}
                  </MenuItem>
                ))
              ) : null}
            </Select>
          </FormControl>

          <Box sx={{ flex: 1 }} />

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={loading || !selectedVeiculo}
          >
            Atualizar
          </Button>
        </Stack>
      </Paper>

      {/* Timeline de Histórico */}
      {loading ? (
        <ContentCard>
          <Box sx={{ p: 3 }}>
            <LoadingState message="Carregando histórico..." />
          </Box>
        </ContentCard>
      ) : !selectedVeiculo ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Selecione um veículo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Escolha um veículo no filtro acima para visualizar seu histórico de serviços
          </Typography>
        </Paper>
      ) : historicos.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum histórico encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Este veículo ainda não possui histórico de serviços registrado
          </Typography>
        </Paper>
      ) : (
        <ContentCard>
          <Box sx={{ p: 3 }}>
            <HistoricoTimeline historicos={historicos} />
          </Box>
        </ContentCard>
      )}
    </PageContainer>
  );
};

export default HistoricoPage;
