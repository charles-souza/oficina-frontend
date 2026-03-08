import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={600}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action && (
          <Button
            variant="contained"
            startIcon={action.icon}
            onClick={action.onClick}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              flexShrink: 0,
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            {action.label}
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default PageHeader;
