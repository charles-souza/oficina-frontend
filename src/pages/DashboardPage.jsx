import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Button } from '@mui/material';
import { clienteService } from '../services/clienteService';

const DashboardPage = () => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCount = async () => {
    setLoading(true);
    setError(null);
    try {
      // Request first page with size 1 and read totalElements from Page response
      const data = await clienteService.getAll(0, 1);
      if (data && typeof data === 'object') {
        const total = data.totalElements ?? data.total ?? (Array.isArray(data) ? data.length : 0);
        setCount(Number(total));
      } else if (Array.isArray(data)) {
        setCount(data.length);
      } else {
        setCount(0);
      }
    } catch (err) {
      console.error('Erro ao buscar total de clientes:', err);
      setError('Erro ao carregar número de clientes');
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      <Paper
        sx={{
          p: 3,
          maxWidth: 480,
          backgroundColor: 'success.main',
          color: 'common.white',
        }}
        elevation={3}
      >
        <Typography variant="h6" sx={{ color: 'common.white' }}>Clientes cadastrados</Typography>

        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <CircularProgress size={24} sx={{ color: 'common.white' }} />
            <Typography sx={{ color: 'common.white' }}>Carregando...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ color: 'common.white' }}>{error}</Typography>
            <Button variant="outlined" onClick={fetchCount} sx={{ mt: 1, color: 'common.white', borderColor: 'rgba(255,255,255,0.6)' }}>Tentar novamente</Button>
          </Box>
        ) : (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'baseline', gap: 2, justifyContent: 'space-between' }}>
            <Typography variant="h3" component="div" sx={{ color: 'common.white' }}>{count ?? 0}</Typography>
            <Button variant="text" onClick={fetchCount} sx={{ color: 'common.white' }}>Atualizar</Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default DashboardPage;
