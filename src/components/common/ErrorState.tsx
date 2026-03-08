import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <ErrorIcon color="error" sx={{ fontSize: 48, mb: 2 }} />
      <Typography color="error" gutterBottom>
        {message}
      </Typography>
      {onRetry && (
        <Button
          variant="outlined"
          onClick={onRetry}
          sx={{ mt: 2, borderRadius: 2 }}
        >
          Tentar novamente
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;
