import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Badge,
  Edit,
  Save,
  Cancel,
} from '@mui/icons-material';
import { usePageTitle } from '../hooks/usePageTitle';
import { useNotification } from '../contexts/NotificationContext';

const PerfilPage: React.FC = () => {
  usePageTitle('Perfil');
  const { showNotification } = useNotification();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nome: 'Usuário Demo',
    email: 'usuario@oficina.com',
    telefone: '(11) 98765-4321',
    cargo: 'Gerente',
    empresa: 'Oficina Demo',
  });

  const [tempData, setTempData] = useState({ ...formData });

  const handleEdit = () => {
    setTempData({ ...formData });
    setEditMode(true);
  };

  const handleCancel = () => {
    setTempData({ ...formData });
    setEditMode(false);
  };

  const handleSave = () => {
    setFormData({ ...tempData });
    setEditMode(false);
    showNotification('Perfil atualizado com sucesso!', 'success');
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempData({ ...tempData, [field]: e.target.value });
  };

  const getInitials = () => {
    return formData.nome
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
          Meu Perfil
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Gerencie suas informações pessoais
        </Typography>
      </Paper>

      {/* Conteúdo */}
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 2fr' }} gap={3}>
        {/* Card do Avatar */}
        <Box>
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
              {formData.nome}
            </Typography>

            <Chip
              label={formData.cargo}
              color="primary"
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" color="text.secondary" gutterBottom>
              {formData.empresa}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Membro desde
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              Janeiro 2024
            </Typography>
          </Paper>
        </Box>

        {/* Card de Informações */}
        <Box>
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
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                  >
                    Salvar
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
                    onChange={handleChange('nome')}
                    size="small"
                  />
                ) : (
                  <Typography variant="body1" fontWeight={500}>
                    {formData.nome}
                  </Typography>
                )}
              </Box>

              {/* Email */}
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Email fontSize="small" color="action" />
                  <Typography variant="subtitle2" color="text.secondary">
                    E-mail
                  </Typography>
                </Box>
                {editMode ? (
                  <TextField
                    fullWidth
                    type="email"
                    value={tempData.email}
                    onChange={handleChange('email')}
                    size="small"
                  />
                ) : (
                  <Typography variant="body1" fontWeight={500}>
                    {formData.email}
                  </Typography>
                )}
              </Box>

              {/* Telefone */}
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Phone fontSize="small" color="action" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Telefone
                  </Typography>
                </Box>
                {editMode ? (
                  <TextField
                    fullWidth
                    value={tempData.telefone}
                    onChange={handleChange('telefone')}
                    size="small"
                  />
                ) : (
                  <Typography variant="body1" fontWeight={500}>
                    {formData.telefone}
                  </Typography>
                )}
              </Box>

              {/* Cargo */}
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Badge fontSize="small" color="action" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Cargo
                  </Typography>
                </Box>
                {editMode ? (
                  <TextField
                    fullWidth
                    value={tempData.cargo}
                    onChange={handleChange('cargo')}
                    size="small"
                  />
                ) : (
                  <Typography variant="body1" fontWeight={500}>
                    {formData.cargo}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default PerfilPage;
