import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
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
import DashboardSkeleton from '../components/common/DashboardSkeleton';
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
      <Box sx={{ p: 3 }}>
        <DashboardSkeleton />
      </Box>
    );
  }

  if (!metrics) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography>Erro ao carregar dados do dashboard</Typography>
        </Paper>
      </Box>
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
    <Box sx={{ p: 3, height: '100%', bgcolor: 'background.default' }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
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
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          mb: 3,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
          <MetricCard
            title="Clientes"
            value={metrics.totalClientes}
            icon={People}
            color="#667eea"
            subtitle="Total cadastrado"
          />
        </Box>

        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
          <MetricCard
            title="Veículos"
            value={metrics.totalVeiculos}
            icon={DirectionsCar}
            color="#06b6d4"
            subtitle="Total cadastrado"
          />
        </Box>

        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
          <MetricCard
            title="Orçamentos"
            value={metrics.totalOrcamentos}
            icon={Description}
            color="#8b5cf6"
            subtitle="Total emitido"
          />
        </Box>

        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
          <MetricCard
            title="Ordens de Serviço"
            value={metrics.totalOrdensServico}
            icon={Assignment}
            color="#f59e0b"
            subtitle="Total registrado"
          />
        </Box>
      </Box>

      {/* Cards de Status das Ordens */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          mb: 3,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
          <MetricCard
            title="Abertas Hoje"
            value={metrics.ordensAbertasHoje}
            icon={Build}
            color="#3b82f6"
            subtitle="Novas ordens"
          />
        </Box>

        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
          <MetricCard
            title="Em Andamento"
            value={metrics.ordensEmAndamento}
            icon={HourglassEmpty}
            color="#06b6d4"
            subtitle="Ordens ativas"
          />
        </Box>

        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
          <MetricCard
            title="Aguardando Peça"
            value={metrics.ordensAguardandoPeca}
            icon={HourglassEmpty}
            color="#f59e0b"
            subtitle="Ordens pausadas"
          />
        </Box>

        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' } }}>
          <MetricCard
            title="Prontas"
            value={metrics.ordensProntas}
            icon={CheckCircle}
            color="#10b981"
            subtitle="Para entrega"
          />
        </Box>
      </Box>

      {/* Gráficos */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          mb: 3,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: { xs: '100%', lg: 'calc(50% - 12px)' } }}>
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
        </Box>

        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: { xs: '100%', lg: 'calc(50% - 12px)' } }}>
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
        </Box>
      </Box>

      {/* Cards de Receita */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: { xs: '100%', md: 'calc(33.333% - 16px)' } }}>
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              bgcolor: 'success.main',
              color: 'white',
              borderRadius: 3,
              height: '100%',
              minHeight: 140,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1, fontWeight: 600 }}>
              Receita de Orçamentos
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {formatCurrency(metrics.receitaOrcamentos)}
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: { xs: '100%', md: 'calc(33.333% - 16px)' } }}>
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              bgcolor: 'info.main',
              color: 'white',
              borderRadius: 3,
              height: '100%',
              minHeight: 140,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1, fontWeight: 600 }}>
              Receita de Ordens
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {formatCurrency(metrics.receitaOrdensServico)}
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: { xs: '100%', md: 'calc(33.333% - 16px)' } }}>
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              height: '100%',
              minHeight: 140,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
              <TrendingUp sx={{ mr: 1 }} />
              <Typography variant="subtitle2" sx={{ opacity: 0.9, fontWeight: 600 }}>
                Receita Mensal
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight={700}>
              {formatCurrency(metrics.receitaMensal)}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
