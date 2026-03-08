import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => {
  return (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: action ? 2 : 0 }}>
        {description}
      </Typography>
      {action && (
        <Button
          variant="outlined"
          onClick={action.onClick}
          startIcon={action.icon}
          sx={{ borderRadius: 2 }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
