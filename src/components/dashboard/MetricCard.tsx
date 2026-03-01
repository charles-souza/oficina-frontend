import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: SvgIconComponent;
  color?: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  color = '#667eea',
  subtitle,
  trend,
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
        transition: 'all 0.3s ease',
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              gutterBottom
              sx={{ textTransform: 'uppercase', fontWeight: 600, fontSize: '0.75rem' }}
            >
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={trend.isPositive ? 'success.main' : 'error.main'}
                >
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </Typography>
                <Typography variant="body2" color="text.secondary" ml={0.5}>
                  vs. mês anterior
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: `${color}20`,
              color: color,
              width: 56,
              height: 56,
            }}
          >
            <Icon fontSize="large" />
          </Avatar>
        </Box>
      </CardContent>

      {/* Decoração de fundo */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          bgcolor: `${color}10`,
          transform: 'translate(30%, 30%)',
        }}
      />
    </Card>
  );
};

export default MetricCard;
