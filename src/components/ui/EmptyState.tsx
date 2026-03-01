import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Inbox } from '@mui/icons-material';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <Paper sx={{ p: 6, textAlign: 'center' }}>
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}
      >
        {icon || <Inbox sx={{ fontSize: 40, color: 'text.secondary' }} />}
      </Box>

      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>

      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
      )}

      {action && (
        <Button variant="contained" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState;
