import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import api from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        senha: formData.senha,
      });

      const data = response.data;

      if (data && (data.token || data.accessToken)) {
        const token = data.token || data.accessToken;
        localStorage.setItem('token', token);
        window.location.href = '/';
      } else {
        setError('Resposta do servidor não contém token.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        const status = err.response.status;
        const srv = err.response.data;

        if (status === 403) {
          const msg = srv.message || srv.error || 'Acesso negado. Verifique suas credenciais.';
          setError(`Erro 403: ${msg}`);
        } else if (status === 401) {
          setError('Email ou senha incorretos.');
        } else {
          const msg = srv.message || srv.error || JSON.stringify(srv);
          setError(`Erro ${status}: ${msg}`);
        }
      } else if (err.request) {
        setError('Nenhuma resposta do servidor. Verifique se o backend está rodando na porta 8080.');
      } else {
        setError(err.message || 'Erro ao tentar efetuar login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', py: 6 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 480 }} elevation={3}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Entrar
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            '& .MuiTextField-root': { width: '100%' },
            '&': { boxSizing: 'border-box' },
          }}
        >
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            inputProps={{ maxLength: 100 }}
          />

          <TextField
            label="Senha"
            name="senha"
            type="password"
            value={formData.senha}
            onChange={handleChange}
            required
            fullWidth
            inputProps={{ maxLength: 100 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ alignSelf: 'stretch' }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Entrar'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
