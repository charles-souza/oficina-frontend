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
        '&:hover': {
          boxShadow: 4,
        },
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <CardContent>
        <Box mb={3}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box>{children}</Box>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
