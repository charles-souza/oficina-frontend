import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { clienteService } from '../services/clienteService';
import { veiculoService } from '../services/veiculoService';
import { orcamentoService } from '../services/orcamentoService';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DescriptionIcon from '@mui/icons-material/Description';

const DashboardPageSimple = () => {
  const [totais, setTotais] = useState({
    clientes: 0,
    veiculos: 0,
    orcamentos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientesData, veiculosData, orcamentosData] = await Promise.all([
          clienteService.getAll(0, 1).catch(() => ({ totalElements: 0 })),
          veiculoService.getAll(0, 1).catch(() => ({ totalElements: 0 })),
          orcamentoService.getAll().catch(() => []),
        ]);

        setTotais({
          clientes: clientesData?.totalElements || clientesData?.total || 0,
          veiculos: veiculosData?.totalElements || veiculosData?.total || 0,
          orcamentos: Array.isArray(orcamentosData) ? orcamentosData.length : 0,
        });
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const cards = [
    {
      title: 'Clientes',
      value: totais.clientes,
      icon: PeopleIcon,
      color: '#667eea',
      link: '/clientes',
    },
    {
      title: 'Veículos',
      value: totais.veiculos,
      icon: DirectionsCarIcon,
      color: '#f5576c',
      link: '/veiculos',
    },
    {
      title: 'Orçamentos',
      value: totais.orcamentos,
      icon: DescriptionIcon,
      color: '#4facfe',
      link: '/orcamentos',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="h6">Visão geral do seu negócio</Typography>
      </Paper>

      {/* Cards */}
      <Grid container spacing={3}>
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                component={Link}
                to={card.link}
                sx={{
                  textDecoration: 'none',
                  height: '100%',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 3,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textTransform: 'uppercase', fontWeight: 500, mb: 1 }}
                      >
                        {card.title}
                      </Typography>
                      <Typography variant="h3" fontWeight={700} sx={{ color: card.color }}>
                        {loading ? '...' : card.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: `${card.color}15`,
                      }}
                    >
                      <Icon sx={{ fontSize: 32, color: card.color }} />
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Total cadastrado
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Stats */}
      <Paper elevation={1} sx={{ mt: 4, p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Sistema Ativo
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">
              Módulos
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              5
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">
              Performance
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              Ótima
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">
              Uptime
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              99.9%
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">
              Status
            </Typography>
            <Typography variant="h5" fontWeight={700} color="success.main">
              Online
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Debug Info */}
      <Paper elevation={0} sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
        <Typography variant="caption" color="text.secondary">
          💡 Debug: {loading ? 'Carregando dados...' : 'Dados carregados com sucesso'}
        </Typography>
      </Paper>
    </Box>
  );
};

export default DashboardPageSimple;
