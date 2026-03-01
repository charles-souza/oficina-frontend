import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  People,
  DirectionsCar,
  Description,
  Assignment,
  TrendingUp,
  CheckCircle,
  HourglassEmpty,
  Build,
} from '@mui/icons-material';
import MetricCard from '../components/dashboard/MetricCard';
import ChartCard from '../components/dashboard/ChartCard';
import { dashboardService, DashboardMetrics } from '../services/dashboardService';
import { useNotification } from '../contexts/NotificationContext';
import { usePageTitle } from '../hooks/usePageTitle';

const DashboardPage: React.FC = () => {
  usePageTitle('Dashboard');

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await dashboardService.getMainMetrics();
      setMetrics(data);
    } catch (error) {
      showNotification('Erro ao carregar dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!metrics) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Erro ao carregar dados do dashboard</Typography>
      </Paper>
    );
  }

  // Dados para gráfico de pizza - Status das Ordens
  const statusData = [
    { name: 'Em Andamento', value: metrics.ordensEmAndamento, color: '#3b82f6' },
    { name: 'Aguardando Peça', value: metrics.ordensAguardandoPeca, color: '#f59e0b' },
    { name: 'Prontas', value: metrics.ordensProntas, color: '#10b981' },
  ].filter((item) => item.value > 0);

  // Dados para gráfico de barras - Resumo Geral
  const summaryData = [
    { name: 'Clientes', value: metrics.totalClientes },
    { name: 'Veículos', value: metrics.totalVeiculos },
    { name: 'Orçamentos', value: metrics.totalOrcamentos },
    { name: 'Ordens', value: metrics.totalOrdensServico },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
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
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Visão geral das operações da oficina
        </Typography>
      </Paper>

      {/* Cards de Métricas Principais */}
      <Grid container spacing={3} mb={3}>
        <Grid xs={12} sm={6} md={3}>
          <MetricCard
            title="Clientes"
            value={metrics.totalClientes}
            icon={People}
            color="#667eea"
            subtitle="Total cadastrado"
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <MetricCard
            title="Veículos"
            value={metrics.totalVeiculos}
            icon={DirectionsCar}
            color="#06b6d4"
            subtitle="Total cadastrado"
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <MetricCard
            title="Orçamentos"
            value={metrics.totalOrcamentos}
            icon={Description}
            color="#8b5cf6"
            subtitle="Total emitido"
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <MetricCard
            title="Ordens de Serviço"
            value={metrics.totalOrdensServico}
            icon={Assignment}
            color="#f59e0b"
            subtitle="Total registrado"
          />
        </Grid>
      </Grid>

      {/* Cards de Status das Ordens */}
      <Grid container spacing={3} mb={3}>
        <Grid xs={12} sm={6} md={3}>
          <MetricCard
            title="Abertas Hoje"
            value={metrics.ordensAbertasHoje}
            icon={Build}
            color="#3b82f6"
            subtitle="Novas ordens"
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <MetricCard
            title="Em Andamento"
            value={metrics.ordensEmAndamento}
            icon={HourglassEmpty}
            color="#06b6d4"
            subtitle="Ordens ativas"
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <MetricCard
            title="Aguardando Peça"
            value={metrics.ordensAguardandoPeca}
            icon={HourglassEmpty}
            color="#f59e0b"
            subtitle="Ordens pausadas"
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <MetricCard
            title="Prontas"
            value={metrics.ordensProntas}
            icon={CheckCircle}
            color="#10b981"
            subtitle="Para entrega"
          />
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} mb={3}>
        {/* Gráfico de Status das Ordens */}
        <Grid xs={12} md={6}>
          <ChartCard
            title="Status das Ordens"
            subtitle="Distribuição atual das ordens de serviço"
          >
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">
                  Nenhuma ordem de serviço ativa
                </Typography>
              </Box>
            )}
          </ChartCard>
        </Grid>

        {/* Gráfico de Resumo Geral */}
        <Grid xs={12} md={6}>
          <ChartCard
            title="Resumo Geral"
            subtitle="Total de registros por categoria"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#667eea" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Cards de Receita */}
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
            <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1 }}>
              Receita de Orçamentos
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {formatCurrency(metrics.receitaOrcamentos)}
            </Typography>
          </Paper>
        </Grid>

        <Grid xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'info.main', color: 'white' }}>
            <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1 }}>
              Receita de Ordens
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {formatCurrency(metrics.receitaOrdensServico)}
            </Typography>
          </Paper>
        </Grid>

        <Grid xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
              <TrendingUp sx={{ mr: 1 }} />
              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                Receita Mensal
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight={700}>
              {formatCurrency(metrics.receitaMensal)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
