import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Fade,
  Grow,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { clienteService } from '../services/clienteService';
import { veiculoService } from '../services/veiculoService';
import { orcamentoService } from '../services/orcamentoService';
import { reciboService } from '../services/reciboService';
import { servicoService } from '../services/servicoService';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DescriptionIcon from '@mui/icons-material/Description';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const DashboardPage = () => {
  const [totais, setTotais] = useState({
    clientes: 0,
    veiculos: 0,
    orcamentos: 0,
    recibos: 0,
    servicos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [clientesData, veiculosData, orcamentosData, recibosData, servicosData] = await Promise.allSettled([
          clienteService.getAll(0, 1),
          veiculoService.getAll(0, 1),
          orcamentoService.getAll(),
          reciboService.getAll(),
          servicoService.getAll(),
        ]);

        setTotais({
          clientes:
            clientesData.status === 'fulfilled'
              ? clientesData.value?.totalElements || clientesData.value?.total || 0
              : 0,
          veiculos:
            veiculosData.status === 'fulfilled'
              ? veiculosData.value?.totalElements || veiculosData.value?.total || 0
              : 0,
          orcamentos:
            orcamentosData.status === 'fulfilled' && Array.isArray(orcamentosData.value)
              ? orcamentosData.value.length
              : 0,
          recibos:
            recibosData.status === 'fulfilled' && Array.isArray(recibosData.value)
              ? recibosData.value.length
              : 0,
          servicos:
            servicosData.status === 'fulfilled' && Array.isArray(servicosData.value)
              ? servicosData.value.length
              : 0,
        });
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        setError('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const cards = [
    {
      title: 'Clientes',
      subtitle: 'Total de clientes cadastrados',
      value: totais.clientes,
      icon: PeopleIcon,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      link: '/clientes',
    },
    {
      title: 'Veículos',
      subtitle: 'Total de veículos cadastrados',
      value: totais.veiculos,
      icon: DirectionsCarIcon,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      link: '/veiculos',
    },
    {
      title: 'Orçamentos',
      subtitle: 'Total de orçamentos criados',
      value: totais.orcamentos,
      icon: DescriptionIcon,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      link: '/orcamentos',
    },
    {
      title: 'Recibos',
      subtitle: 'Total de recibos gerados',
      value: totais.recibos,
      icon: ReceiptIcon,
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      link: '/recibos',
    },
    {
      title: 'Serviços',
      subtitle: 'Total de serviços cadastrados',
      value: totais.servicos,
      icon: HomeRepairServiceIcon,
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      link: '/servicos',
    },
  ];

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Fade in timeout={400}>
        <Box>
          {/* Hero Header */}
          <Paper
            elevation={0}
            sx={{
              mb: 4,
              p: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                opacity: 0.1,
                background:
                  'radial-gradient(circle at top right, white 0%, transparent 50%), radial-gradient(circle at bottom left, white 0%, transparent 50%)',
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <AssessmentIcon sx={{ fontSize: 32 }} />
                <Typography variant="h3" component="h1" fontWeight={700}>
                  Dashboard
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 400 }}>
                Visão geral do seu negócio em tempo real
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>
                    Sistema
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    Oficina SaaS
                  </Typography>
                </Box>

                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>
                    Status
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#4ade80',
                        animation: 'pulse 2s ease-in-out infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 1 },
                          '50%': { opacity: 0.5 },
                        },
                      }}
                    />
                    <Typography variant="body2" fontWeight={600}>
                      Online
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Metrics Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(5, 1fr)',
              },
              gap: 3,
              mb: 4,
            }}
          >
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Grow in timeout={600 + index * 100} key={index}>
                  <Card
                    component={Link}
                    to={card.link}
                    sx={{
                      height: '100%',
                      minHeight: 180,
                      borderRadius: 3,
                      textDecoration: 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      background: card.gradient,
                      color: 'white',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0.1,
                        background: 'radial-gradient(circle at top right, white 0%, transparent 70%)',
                      }}
                    />

                    <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
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
                            sx={{
                              opacity: 0.9,
                              fontWeight: 500,
                              letterSpacing: 0.5,
                              textTransform: 'uppercase',
                              fontSize: '0.75rem',
                            }}
                          >
                            {card.title}
                          </Typography>
                          {card.subtitle && (
                            <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                              {card.subtitle}
                            </Typography>
                          )}
                        </Box>

                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <Icon sx={{ fontSize: 28 }} />
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        {loading ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CircularProgress size={32} sx={{ color: 'white' }} />
                            <Typography variant="h4" fontWeight={700}>
                              ...
                            </Typography>
                          </Box>
                        ) : error ? (
                          <Typography variant="h4" fontWeight={700}>
                            --
                          </Typography>
                        ) : (
                          <Typography
                            variant="h3"
                            fontWeight={700}
                            sx={{
                              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                              lineHeight: 1,
                            }}
                          >
                            {card.value.toLocaleString('pt-BR')}
                          </Typography>
                        )}
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          pt: 2,
                          borderTop: '1px solid rgba(255,255,255,0.2)',
                          opacity: 0.9,
                        }}
                      >
                        <TrendingUpIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" fontWeight={500}>
                          Total cadastrado
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              );
            })}
          </Box>

          {/* Quick Stats */}
          <Fade in timeout={1000}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <TrendingUpIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Estatísticas Rápidas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Resumo das operações do sistema
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(4, 1fr)',
                  },
                  gap: 3,
                }}
              >
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'rgba(102, 126, 234, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Módulos Ativos
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="primary" sx={{ mt: 1 }}>
                    5
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Sistema completo
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'rgba(245, 87, 108, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(245, 87, 108, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Performance
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#f5576c', mt: 1 }}>
                    Ótima
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Sistema rápido
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'rgba(79, 172, 254, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(79, 172, 254, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Disponibilidade
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#4facfe', mt: 1 }}>
                    99.9%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Uptime garantido
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'rgba(74, 222, 128, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(74, 222, 128, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    Segurança
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#4ade80', mt: 1 }}>
                    100%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Dados protegidos
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Fade>

          {/* Welcome Message */}
          <Fade in timeout={1200}>
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                💡 <strong>Dica:</strong> Clique em qualquer card acima para acessar a área correspondente e
                gerenciar seus dados.
              </Typography>
            </Paper>
          </Fade>
        </Box>
      </Fade>
    </Box>
  );
};

export default DashboardPage;
