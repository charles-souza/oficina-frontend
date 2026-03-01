import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, CircularProgress, IconButton, Fade, Grow } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const MetricCard = ({ title, subtitle, fetchTotal, linkTo, icon: Icon, gradient, delay = 0 }) => {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const loadTotal = async () => {
    setLoading(true);
    setError(false);
    try {
      const count = await fetchTotal();
      setTotal(count || 0);
    } catch (e) {
      console.error(`Erro ao carregar total de ${title}:`, e);
      setError(true);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grow in timeout={600 + delay}>
      <Card
        component={RouterLink}
        to={linkTo}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          height: '100%',
          borderRadius: 3,
          textDecoration: 'none',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          background: gradient,
          color: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          },
        }}
      >
        {/* Background Pattern */}
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
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
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
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                  {subtitle}
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
              {Icon && <Icon sx={{ fontSize: 28 }} />}
            </Box>
          </Box>

          {/* Metric Value */}
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
              <Fade in timeout={800}>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    lineHeight: 1,
                  }}
                >
                  {total.toLocaleString('pt-BR')}
                </Typography>
              </Fade>
            )}
          </Box>

          {/* Footer Actions */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 2,
              borderTop: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.9 }}>
              <TrendingUpIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" fontWeight={500}>
                Total cadastrado
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  loadTotal();
                }}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                  },
                }}
              >
                <RefreshIcon sx={{ fontSize: 18 }} />
              </IconButton>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 28,
                  height: 28,
                  borderRadius: 1,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                }}
              >
                <ArrowForwardIcon sx={{ fontSize: 18 }} />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  fetchTotal: PropTypes.func.isRequired,
  linkTo: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  gradient: PropTypes.string.isRequired,
  delay: PropTypes.number,
};

export default MetricCard;
