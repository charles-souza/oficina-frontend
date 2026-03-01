import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
  Button,
  TextField,
  Alert,
  AlertTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Notifications,
  Security,
  Language,
  Palette,
  Save,
} from '@mui/icons-material';
import { usePageTitle } from '../hooks/usePageTitle';
import { useNotification } from '../contexts/NotificationContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

const ConfiguracoesPage: React.FC = () => {
  usePageTitle('Configurações');
  const { showNotification } = useNotification();
  const { mode, toggleTheme } = useCustomTheme();

  const [notificacoes, setNotificacoes] = useState({
    email: true,
    push: false,
    novasOrdens: true,
    statusOrdens: true,
    orcamentos: false,
  });

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [idioma, setIdioma] = useState('pt-BR');

  const handleNotificacaoChange = (key: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNotificacoes({ ...notificacoes, [key]: event.target.checked });
  };

  const handleSalvarSenha = () => {
    if (novaSenha !== confirmarSenha) {
      showNotification('As senhas não coincidem', 'error');
      return;
    }
    if (novaSenha.length < 6) {
      showNotification('A senha deve ter no mínimo 6 caracteres', 'error');
      return;
    }

    // Simular salvamento
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarSenha('');
    showNotification('Senha alterada com sucesso!', 'success');
  };

  const handleSalvarNotificacoes = () => {
    showNotification('Preferências de notificações salvas!', 'success');
  };

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
          Configurações
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Personalize sua experiência no sistema
        </Typography>
      </Paper>

      <Stack spacing={3}>
        {/* Tema */}
        <Paper sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Palette color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Aparência
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <FormControlLabel
            control={
              <Switch
                checked={mode === 'dark'}
                onChange={toggleTheme}
                color="primary"
              />
            }
            label={mode === 'dark' ? 'Tema Escuro' : 'Tema Claro'}
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5 }}>
            Alterna entre modo claro e escuro
          </Typography>
        </Paper>

        {/* Idioma */}
        <Paper sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Language color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Idioma
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <FormControl fullWidth size="small" sx={{ maxWidth: 300 }}>
            <InputLabel>Selecione o idioma</InputLabel>
            <Select
              value={idioma}
              onChange={(e) => setIdioma(e.target.value)}
              label="Selecione o idioma"
            >
              <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {/* Notificações */}
        <Paper sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Notifications color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Notificações
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Canais de Notificação
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificacoes.email}
                    onChange={handleNotificacaoChange('email')}
                  />
                }
                label="Notificações por E-mail"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 1 }}>
                Receba alertas importantes por e-mail
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={notificacoes.push}
                    onChange={handleNotificacaoChange('push')}
                  />
                }
                label="Notificações Push"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                Receba notificações em tempo real no navegador
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Tipos de Notificação
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificacoes.novasOrdens}
                    onChange={handleNotificacaoChange('novasOrdens')}
                  />
                }
                label="Novas Ordens de Serviço"
              />
              <br />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificacoes.statusOrdens}
                    onChange={handleNotificacaoChange('statusOrdens')}
                  />
                }
                label="Mudanças de Status"
              />
              <br />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificacoes.orcamentos}
                    onChange={handleNotificacaoChange('orcamentos')}
                  />
                }
                label="Novos Orçamentos"
              />
            </Box>

            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSalvarNotificacoes}
              >
                Salvar Preferências
              </Button>
            </Box>
          </Stack>
        </Paper>

        {/* Segurança */}
        <Paper sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Security color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Segurança
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <Alert severity="info" sx={{ mb: 3 }}>
            <AlertTitle>Alterar Senha</AlertTitle>
            Recomendamos alterar sua senha periodicamente para manter sua conta segura.
          </Alert>

          <Stack spacing={2} sx={{ maxWidth: 500 }}>
            <TextField
              label="Senha Atual"
              type="password"
              fullWidth
              size="small"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
            />
            <TextField
              label="Nova Senha"
              type="password"
              fullWidth
              size="small"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              helperText="Mínimo de 6 caracteres"
            />
            <TextField
              label="Confirmar Nova Senha"
              type="password"
              fullWidth
              size="small"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />

            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSalvarSenha}
                disabled={!senhaAtual || !novaSenha || !confirmarSenha}
              >
                Alterar Senha
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default ConfiguracoesPage;
