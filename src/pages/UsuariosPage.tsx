import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

interface Usuario {
  id: string;
  email: string;
  nome: string;
  roles: string;
  oficinaId: string;
}

const UsuariosPage: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);

  // Fetch users
  const { data: usuarios, isLoading, error } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const response = await api.get<Usuario[]>('/usuarios');
      return response.data;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/usuarios/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      showNotification('Usuário excluído com sucesso!', 'success');
      setDeleteDialogOpen(false);
      setUsuarioToDelete(null);
    },
    onError: (error: any) => {
      console.error('Erro ao excluir usuário:', error);
      showNotification(
        error.response?.data?.message || 'Erro ao excluir usuário',
        'error'
      );
    },
  });

  const handleDeleteClick = (usuario: Usuario) => {
    setUsuarioToDelete(usuario);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (usuarioToDelete) {
      deleteMutation.mutate(usuarioToDelete.id);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUsuarioToDelete(null);
  };

  const getRoleColor = (role: string) => {
    if (role === 'ROLE_ADMIN') return 'primary';
    if (role === 'ROLE_MECANICO') return 'secondary';
    return 'default';
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
          Erro ao carregar usuários: {error instanceof Error ? error.message : 'Erro desconhecido'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            Gerenciamento de Usuários
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/usuarios/novo')}
          >
            Novo Usuário
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nome</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell align="right"><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios?.map((usuario) => (
                <TableRow key={usuario.id} hover>
                  <TableCell>{usuario.nome}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleLabel(usuario.roles)}
                      color={getRoleColor(usuario.roles)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/usuarios/editar/${usuario.id}`)}
                      title="Editar"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(usuario)}
                      title="Excluir"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {usuarios?.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              Nenhum usuário encontrado
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o usuário <strong>{usuarioToDelete?.nome}</strong> ({usuarioToDelete?.email})?
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteMutation.isPending}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <CircularProgress size={24} /> : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsuariosPage;
