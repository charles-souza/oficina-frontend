import React from 'react';
import { Box, Typography, Paper, Alert, AlertTitle } from '@mui/material';
import { Build, Construction } from '@mui/icons-material';
import { usePageTitle } from '../hooks/usePageTitle';

const ServicosPage: React.FC = () => {
  usePageTitle('Serviços');

  return (
    <Box>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Catálogo de Serviços
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Gerencie os serviços oferecidos pela oficina
        </Typography>
      </Paper>

      {/* Conteúdo */}
      <Paper sx={{ p: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 400,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              position: 'relative',
            }}
          >
            <Build sx={{ fontSize: 60, color: 'white' }} />
            <Construction
              sx={{
                fontSize: 30,
                color: 'white',
                position: 'absolute',
                bottom: 10,
                right: 10,
              }}
            />
          </Box>

          <Typography variant="h5" fontWeight={600} gutterBottom>
            Funcionalidade em Desenvolvimento
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 600 }}
          >
            O catálogo de serviços permite criar um banco de dados com os serviços
            oferecidos pela oficina (ex: "Troca de óleo", "Alinhamento", "Balanceamento")
            com seus respectivos preços e tempos estimados.
          </Typography>

          <Alert severity="info" sx={{ maxWidth: 600 }}>
            <AlertTitle>Backend não implementado</AlertTitle>
            Esta funcionalidade requer a implementação do endpoint{' '}
            <code>/api/servicos</code> no backend. Atualmente, o backend possui apenas
            endpoints para Ordens de Serviço (<code>/api/ordens-servico</code>).
          </Alert>

          <Box sx={{ mt: 3 }}>
            <Alert severity="warning" sx={{ maxWidth: 600 }}>
              <AlertTitle>Funcionalidades disponíveis</AlertTitle>
              Você pode criar ordens de serviço em <strong>Ordens de Serviço</strong>,
              onde é possível adicionar itens de serviço diretamente em cada ordem.
            </Alert>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ServicosPage;
