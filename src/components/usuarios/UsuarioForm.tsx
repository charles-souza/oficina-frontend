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
    <Box p={3}>
      <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          {isEditMode ? 'Editar Usuário' : 'Novo Usuário'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {!isEditMode && (
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              required
            />
          )}

          <TextField
            fullWidth
            label="Nome"
            value={formData.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            error={!!errors.nome}
            helperText={errors.nome}
            margin="normal"
            required
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
            label="Role"
            value={formData.roles}
            onChange={(e) => handleChange('roles', e.target.value)}
            error={!!errors.roles}
            helperText={errors.roles}
            margin="normal"
            required
          >
            <MenuItem value="ROLE_ADMIN">Administrador</MenuItem>
            <MenuItem value="ROLE_MECANICO">Mecânico</MenuItem>
            <MenuItem value="ROLE_USER">Usuário</MenuItem>
          </TextField>

          {isEditMode && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Email não pode ser alterado. Para alterar a senha, entre em contato com o administrador.
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              fullWidth
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
