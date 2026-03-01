import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import HistoricoTimeline from '../components/historico/HistoricoTimeline';
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
    loadHistoricos();
  }, []);

  useEffect(() => {
    if (selectedVeiculo) {
      loadHistoricosByVeiculo(selectedVeiculo as number);
    } else {
      loadHistoricos();
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

  const loadHistoricos = async () => {
    setLoading(true);
    try {
      const response = await historicoService.getAll(0, 50);
      setHistoricos(response.content);
    } catch (error) {
      showNotification('Erro ao carregar histórico', 'error');
    } finally {
      setLoading(false);
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
    } else {
      loadHistoricos();
    }
  };

  return (
    <Box>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Histórico de Serviços
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Visualize todo o histórico de eventos e alterações
        </Typography>
      </Paper>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
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
                {veiculos.map((veiculo) => (
                  <MenuItem key={veiculo.id} value={veiculo.id}>
                    {veiculo.placa} - {veiculo.marca} {veiculo.modelo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={8}>
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                disabled={loading}
              >
                Atualizar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Timeline de Histórico */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <HistoricoTimeline historicos={historicos} />
      )}
    </Box>
  );
};

export default HistoricoPage;
