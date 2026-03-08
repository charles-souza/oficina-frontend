import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, hasAnyRole } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return null; // Let the route protection handle this
  }

  // Check if user has any of the allowed roles
  if (!hasAnyRole(...allowedRoles)) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          p: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 500,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <LockIcon sx={{ fontSize: 64, color: 'error.main' }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Acesso Negado
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Você não tem permissão para acessar esta página. Entre em contato com o administrador se você acredita que isso é um erro.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Voltar para Início
          </Button>
        </Paper>
      </Box>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
