import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children }) => {
  return (
    <Card
      sx={{
        height: '100%',
        minHeight: 400,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: 4,
        },
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box mb={2}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box flex={1} display="flex" alignItems="center" justifyContent="center">
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
