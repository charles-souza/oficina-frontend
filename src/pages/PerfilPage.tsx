import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  Divider,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import {
  Person,
  Email,
  Badge,
  Edit,
  Save,
  Cancel,
  Lock,
} from '@mui/icons-material';
import { usePageTitle } from '../hooks/usePageTitle';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

interface UsuarioPerfil {
  id: string;
  email: string;
  nome: string;
  roles: string;
  oficinaId: string;
}

interface PerfilUpdateData {
  nome: string;
}

interface SenhaUpdateData {
  senhaAtual: string;
  novaSenha: string;
  confirmacaoSenha: string;
}

const PerfilPage: React.FC = () => {
  usePageTitle('Meu Perfil');
  const { showNotification } = useNotification();
  const { user, roles } = useAuth();
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [tempData, setTempData] = useState({ nome: '' });
  const [senhaData, setSenhaData] = useState<SenhaUpdateData>({
    senhaAtual: '',
    novaSenha: '',
    confirmacaoSenha: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Buscar dados do perfil
  const { data: perfil, isLoading, error } = useQuery({
    queryKey: ['perfil'],
    queryFn: async () => {
      const response = await api.get<UsuarioPerfil>('/usuarios/perfil');
      return response.data;
    },
  });

  useEffect(() => {
    if (perfil) {
      setTempData({ nome: perfil.nome });
    }
  }, [perfil]);

  // Mutation para atualizar perfil
  const updatePerfilMutation = useMutation({
    mutationFn: async (data: PerfilUpdateData) => {
      const response = await api.put('/usuarios/perfil', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfil'] });
      showNotification('Perfil atualizado com sucesso!', 'success');
      setEditMode(false);
    },
    onError: (error: any) => {
      showNotification(
        error.response?.data?.message || 'Erro ao atualizar perfil',
        'error'
      );
    },
  });

  // Mutation para atualizar senha
  const updateSenhaMutation = useMutation({
    mutationFn: async (data: { senhaAtual: string; novaSenha: string }) => {
      const response = await api.put('/usuarios/perfil/senha', data);
      return response.data;
    },
    onSuccess: () => {
      showNotification('Senha atualizada com sucesso!', 'success');
      setChangingPassword(false);
      setSenhaData({
        senhaAtual: '',
        novaSenha: '',
        confirmacaoSenha: '',
      });
      setErrors({});
    },
    onError: (error: any) => {
      showNotification(
        error.response?.data?.message || 'Erro ao atualizar senha',
        'error'
      );
    },
  });

  const handleEdit = () => {
    if (perfil) {
      setTempData({ nome: perfil.nome });
      setEditMode(true);
    }
  };

  const handleCancel = () => {
    if (perfil) {
      setTempData({ nome: perfil.nome });
    }
    setEditMode(false);
    setErrors({});
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!tempData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (tempData.nome.length < 3) {
      newErrors.nome = 'Nome deve ter no mínimo 3 caracteres';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      updatePerfilMutation.mutate({ nome: tempData.nome });
    }
  };

  const handleCancelPasswordChange = () => {
    setChangingPassword(false);
    setSenhaData({
      senhaAtual: '',
      novaSenha: '',
      confirmacaoSenha: '',
    });
    setErrors({});
  };

  const handleSavePassword = () => {
    const newErrors: Record<string, string> = {};

    if (!senhaData.senhaAtual) {
      newErrors.senhaAtual = 'Senha atual é obrigatória';
    }

    if (!senhaData.novaSenha) {
      newErrors.novaSenha = 'Nova senha é obrigatória';
    } else if (senhaData.novaSenha.length < 6) {
      newErrors.novaSenha = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (senhaData.novaSenha !== senhaData.confirmacaoSenha) {
      newErrors.confirmacaoSenha = 'As senhas não coincidem';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      updateSenhaMutation.mutate({
        senhaAtual: senhaData.senhaAtual,
        novaSenha: senhaData.novaSenha,
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setTempData({ ...tempData, [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSenhaChange = (field: keyof SenhaUpdateData, value: string) => {
    setSenhaData({ ...senhaData, [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const getInitials = () => {
    if (!perfil?.nome) return 'U';
    return perfil.nome
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleLabel = (role: string) => {
    if (role === 'ROLE_ADMIN') return 'Administrador';
    if (role === 'ROLE_MECANICO') return 'Mecânico';
    if (role === 'ROLE_USER') return 'Usuário';
    return role;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Erro ao carregar perfil: {error instanceof Error ? error.message : 'Erro desconhecido'}
        </Alert>
      </Box>
    );
  }

  if (!perfil) {
    return (
      <Box p={3}>
        <Alert severity="warning">Perfil não encontrado</Alert>
      </Box>
    );
  }

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
          Meu Perfil
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Gerencie suas informações pessoais e segurança
        </Typography>
      </Paper>

      {/* Conteúdo */}
      <Grid container spacing={3}>
        {/* Card do Avatar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto',
                fontSize: '2.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                mb: 2,
              }}
            >
              {getInitials()}
            </Avatar>

            <Typography variant="h5" fontWeight={600} gutterBottom>
              {perfil.nome}
            </Typography>

            <Chip
              label={getRoleLabel(perfil.roles)}
              color="primary"
              sx={{ mb: 2 }}
            />

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                E-mail
              </Typography>
              <Typography variant="body1" fontWeight={500} sx={{ mb: 2, wordBreak: 'break-word' }}>
                {perfil.email}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                ID da Oficina
              </Typography>
              <Typography variant="body1" fontWeight={500} sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                {perfil.oficinaId}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Card de Informações e Senha */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* Informações Pessoais */}
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight={600}>
                  Informações Pessoais
                </Typography>

                {!editMode ? (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                    disabled={updatePerfilMutation.isPending}
                  >
                    Editar
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      disabled={updatePerfilMutation.isPending}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      disabled={updatePerfilMutation.isPending}
                    >
                      {updatePerfilMutation.isPending ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        'Salvar'
                      )}
                    </Button>
                  </Stack>
                )}
              </Box>

              <Stack spacing={3}>
                {/* Nome */}
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="subtitle2" color="text.secondary">
                      Nome Completo
                    </Typography>
                  </Box>
                  {editMode ? (
                    <TextField
                      fullWidth
                      value={tempData.nome}
                      onChange={(e) => handleChange('nome', e.target.value)}
                      error={!!errors.nome}
                      helperText={errors.nome}
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" fontWeight={500}>
                      {perfil.nome}
                    </Typography>
                  )}
                </Box>

                {/* Email (read-only) */}
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="subtitle2" color="text.secondary">
                      E-mail
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={500} color="text.secondary">
                    {perfil.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    O e-mail não pode ser alterado
                  </Typography>
                </Box>

                {/* Role (read-only) */}
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Badge fontSize="small" color="action" />
                    <Typography variant="subtitle2" color="text.secondary">
                      Perfil de Acesso
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={500} color="text.secondary">
                    {getRoleLabel(perfil.roles)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Entre em contato com o administrador para alterar
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Alterar Senha */}
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Segurança
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Altere sua senha de acesso
                  </Typography>
                </Box>

                {!changingPassword ? (
                  <Button
                    variant="outlined"
                    startIcon={<Lock />}
                    onClick={() => setChangingPassword(true)}
                    disabled={editMode || updateSenhaMutation.isPending}
                  >
                    Alterar Senha
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      onClick={handleCancelPasswordChange}
                      disabled={updateSenhaMutation.isPending}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSavePassword}
                      disabled={updateSenhaMutation.isPending}
                    >
                      {updateSenhaMutation.isPending ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        'Salvar'
                      )}
                    </Button>
                  </Stack>
                )}
              </Box>

              {changingPassword && (
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Senha Atual"
                    value={senhaData.senhaAtual}
                    onChange={(e) => handleSenhaChange('senhaAtual', e.target.value)}
                    error={!!errors.senhaAtual}
                    helperText={errors.senhaAtual}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="Nova Senha"
                    value={senhaData.novaSenha}
                    onChange={(e) => handleSenhaChange('novaSenha', e.target.value)}
                    error={!!errors.novaSenha}
                    helperText={errors.novaSenha || 'Mínimo 6 caracteres'}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="Confirmar Nova Senha"
                    value={senhaData.confirmacaoSenha}
                    onChange={(e) => handleSenhaChange('confirmacaoSenha', e.target.value)}
                    error={!!errors.confirmacaoSenha}
                    helperText={errors.confirmacaoSenha}
                    size="small"
                  />
                </Stack>
              )}

              {!changingPassword && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Por questões de segurança, recomendamos alterar sua senha periodicamente.
                </Alert>
              )}
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PerfilPage;
