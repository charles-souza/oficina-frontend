import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';

interface Usuario {
  id: string;
  email: string;
  nome: string;
  roles: string;
  oficinaId: string;
}

interface UsuarioFormData {
  email: string;
  nome: string;
  senha: string;
  roles: string;
}

const UsuarioForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<UsuarioFormData>({
    email: '',
    nome: '',
    senha: '',
    roles: 'ROLE_USER',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch usuario para edição
  const { data: usuario, isLoading: loadingUsuario } = useQuery({
    queryKey: ['usuario', id],
    queryFn: async () => {
      const response = await api.get<Usuario>(`/usuarios/${id}`);
      return response.data;
    },
    enabled: isEditMode,
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        email: usuario.email,
        nome: usuario.nome,
        senha: '',
        roles: usuario.roles,
      });
    }
  }, [usuario]);

  // Mutation para criar
  const createMutation = useMutation({
    mutationFn: async (data: UsuarioFormData) => {
      const response = await api.post('/usuarios', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      showNotification('Usuário criado com sucesso!', 'success');
      navigate('/usuarios');
    },
    onError: (error: any) => {
      console.error('Erro ao criar usuário:', error);
      showNotification(
        error.response?.data?.message || 'Erro ao criar usuário',
        'error'
      );
    },
  });

  // Mutation para atualizar
  const updateMutation = useMutation({
    mutationFn: async (data: { nome: string; roles: string }) => {
      const response = await api.put(`/usuarios/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['usuario', id] });
      showNotification('Usuário atualizado com sucesso!', 'success');
      navigate('/usuarios');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar usuário:', error);
      showNotification(
        error.response?.data?.message || 'Erro ao atualizar usuário',
        'error'
      );
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.length < 3) {
      newErrors.nome = 'Nome deve ter no mínimo 3 caracteres';
    }

    if (!isEditMode) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email é obrigatório';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }

      if (!formData.senha) {
        newErrors.senha = 'Senha é obrigatória';
      } else if (formData.senha.length < 6) {
        newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
      }
    }

    if (!formData.roles) {
      newErrors.roles = 'Role é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (isEditMode) {
      updateMutation.mutate({
        nome: formData.nome,
        roles: formData.roles,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (field: keyof UsuarioFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  if (isEditMode && loadingUsuario) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

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
          {isEditMode ? 'Editar Usuário' : 'Novo Usuário'}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          {isEditMode
            ? 'Atualize as informações e permissões do usuário'
            : 'Adicione um novo usuário ao sistema'}
        </Typography>
      </Paper>

      {/* Formulário */}
      <Paper sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
        <Box component="form" onSubmit={handleSubmit}>
          {isEditMode && usuario && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Editando usuário: <strong>{usuario.email}</strong>
            </Alert>
          )}

          {!isEditMode && (
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email || 'O email será usado para login'}
              margin="normal"
              required
              autoFocus
            />
          )}

          <TextField
            fullWidth
            label="Nome Completo"
            value={formData.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            error={!!errors.nome}
            helperText={errors.nome || 'Nome que será exibido no sistema'}
            margin="normal"
            required
            autoFocus={isEditMode}
          />

          {!isEditMode && (
            <TextField
              fullWidth
              label="Senha"
              type="password"
              value={formData.senha}
              onChange={(e) => handleChange('senha', e.target.value)}
              error={!!errors.senha}
              helperText={errors.senha || 'Mínimo 6 caracteres'}
              margin="normal"
              required
            />
          )}

          <TextField
            fullWidth
            select
            label="Perfil de Acesso"
            value={formData.roles}
            onChange={(e) => handleChange('roles', e.target.value)}
            error={!!errors.roles}
            helperText={errors.roles || 'Define as permissões do usuário no sistema'}
            margin="normal"
            required
          >
            <MenuItem value="ROLE_ADMIN">
              <Box>
                <Typography fontWeight={600}>Administrador</Typography>
                <Typography variant="caption" color="text.secondary">
                  Acesso completo a todas as funcionalidades
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem value="ROLE_MECANICO">
              <Box>
                <Typography fontWeight={600}>Mecânico</Typography>
                <Typography variant="caption" color="text.secondary">
                  Acesso a ordens de serviço e orçamentos
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem value="ROLE_USER">
              <Box>
                <Typography fontWeight={600}>Usuário</Typography>
                <Typography variant="caption" color="text.secondary">
                  Acesso básico ao sistema
                </Typography>
              </Box>
            </MenuItem>
          </TextField>

          {isEditMode && (
            <Alert severity="warning" sx={{ mt: 3 }}>
              <strong>Atenção:</strong> O email não pode ser alterado. A alteração de senha deve ser feita pelo próprio usuário na tela de perfil.
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : isEditMode ? (
                'Salvar Alterações'
              ) : (
                'Criar Usuário'
              )}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/usuarios')}
              disabled={isSubmitting}
              fullWidth
              size="large"
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default UsuarioForm;
