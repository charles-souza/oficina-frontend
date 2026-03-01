import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  IconButton,
  InputAdornment,
  Fade,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClienteList from '../components/clientes/ClienteList';
import ClienteFormModal from '../components/clientes/ClienteFormModal';
import { clienteService } from '../services/clienteService';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useNotification } from '../contexts/NotificationContext';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';

const ClientesPage = () => {
  const { showSuccess, showError } = useNotification();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const fetchAll = useCallback(
    async (p = 0, size = rowsPerPage) => {
      setLoading(true);
      try {
        setError(null);
        const data = await clienteService.getAll(p, size, {});
        if (data && data.content) {
          setClientes(data.content);
          setTotal(data.totalElements || data.total || 0);
        } else if (Array.isArray(data)) {
          setClientes(data);
          setTotal(data.length);
        } else {
          setClientes([]);
          setTotal(0);
        }
      } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        setError(ERROR_MESSAGES.LOAD_CLIENTS);
        showError(ERROR_MESSAGES.LOAD_CLIENTS);
        setClientes([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [rowsPerPage, showError]
  );

  const fetchByName = useCallback(
    async (nome) => {
      setLoading(true);
      try {
        setError(null);
        const data = await clienteService.getByName(nome);
        if (Array.isArray(data)) {
          setClientes(data);
          setTotal(data.length);
        } else if (data && data.content) {
          setClientes(data.content);
          setTotal(data.totalElements || data.total || 0);
        } else {
          setClientes([]);
          setTotal(0);
        }
      } catch (err) {
        console.error('Erro ao buscar por nome:', err);
        setError(ERROR_MESSAGES.LOAD_CLIENTS);
        showError(ERROR_MESSAGES.LOAD_CLIENTS);
        setClientes([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [showError]
  );

  useEffect(() => {}, []);

  const openNewModal = () => {
    setSelectedCliente(null);
    setModalOpen(true);
  };

  const openEditModal = (cliente) => {
    setSelectedCliente(cliente);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCliente(null);
    setModalOpen(false);
  };

  const handleSave = async (cliente) => {
    try {
      if (cliente && cliente.id) await clienteService.update(cliente.id, cliente);
      else await clienteService.create(cliente);
      showSuccess(SUCCESS_MESSAGES.SAVE_CLIENT);
      if (searchTerm.trim()) await fetchByName(searchTerm.trim());
      else await fetchAll(0, rowsPerPage);
      setHasSearched(true);
      setModalOpen(false);
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      setError(ERROR_MESSAGES.SAVE_CLIENT);
      showError(ERROR_MESSAGES.SAVE_CLIENT);
    }
  };

  const handleDeleteConfirm = (id) => {
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!toDeleteId) return;
    setDeleting(true);
    try {
      await clienteService.delete(toDeleteId);
      showSuccess(SUCCESS_MESSAGES.DELETE_CLIENT);
      setConfirmOpen(false);
      setToDeleteId(null);
      if (searchTerm.trim()) await fetchByName(searchTerm.trim());
      else await fetchAll(page, rowsPerPage);
      setHasSearched(true);
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      setError(ERROR_MESSAGES.DELETE_CLIENT);
      showError(ERROR_MESSAGES.DELETE_CLIENT);
    } finally {
      setDeleting(false);
    }
  };

  const handleChangePage = async (_event, newPage) => {
    setPage(newPage);
    if (searchTerm.trim()) await fetchByName(searchTerm.trim());
    else await fetchAll(newPage, rowsPerPage);
    setHasSearched(true);
  };

  const handleChangeRowsPerPage = async (event) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
    if (searchTerm.trim()) await fetchByName(searchTerm.trim());
    else await fetchAll(0, newSize);
    setHasSearched(true);
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const term = searchTerm.trim();
    if (!term) {
      await fetchAll(0, rowsPerPage);
    } else {
      await fetchByName(term);
    }
    setHasSearched(true);
  };

  const handleClear = () => {
    setSearchTerm('');
    setHasSearched(false);
    setClientes([]);
    setTotal(0);
    setError(null);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Fade in timeout={400}>
        <Box>
          {/* Header com gradiente */}
          <Paper
            elevation={0}
            sx={{
              mb: 3,
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h4" component="h1" fontWeight={600}>
              Gerenciamento de Clientes
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
              Cadastre e gerencie todos os seus clientes
            </Typography>
          </Paper>

          {/* Card principal */}
          <Paper
            elevation={1}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            {/* Barra de ações */}
            <Box
              sx={{
                p: 3,
                borderBottom: '1px solid',
                borderColor: 'divider',
                background: 'rgba(0,0,0,0.02)',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                {/* Botão Novo Cliente */}
                <Button
                  variant="contained"
                  onClick={openNewModal}
                  startIcon={<AddIcon />}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    px: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
                      background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)',
                    },
                  }}
                >
                  Novo Cliente
                </Button>

                {/* Botão Carregar Clientes */}
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm('');
                    fetchAll(0, rowsPerPage);
                    setHasSearched(true);
                  }}
                  startIcon={<RefreshIcon />}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    px: 3,
                    textTransform: 'none',
                    fontWeight: 500,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    },
                  }}
                >
                  Carregar Clientes
                </Button>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                }}
              >
                {/* Campo de busca */}
                <Box
                  component="form"
                  onSubmit={handleSearch}
                  sx={{
                    display: 'flex',
                    gap: 1,
                    flexGrow: 1,
                  }}
                >
                  <TextField
                    size="small"
                    placeholder="Pesquisar por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'white',
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="pesquisar"
                            onClick={handleSearch}
                            edge="end"
                            size="small"
                          >
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <IconButton
                    aria-label="limpar"
                    onClick={handleClear}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Conteúdo da lista */}
            <Box sx={{ p: 3 }}>
              {loading ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 200,
                  }}
                >
                  <Typography color="text.secondary">Carregando clientes...</Typography>
                </Box>
              ) : error ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="error" gutterBottom>
                    {error}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (searchTerm.trim()) fetchByName(searchTerm.trim());
                      else fetchAll(0, rowsPerPage);
                    }}
                    sx={{ mt: 2, borderRadius: 2 }}
                  >
                    Tentar novamente
                  </Button>
                </Box>
              ) : !clientes || clientes.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {hasSearched ? 'Nenhum cliente encontrado' : 'Nenhuma busca realizada'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {hasSearched
                      ? 'Tente uma nova busca ou limpe os filtros'
                      : 'Use o campo de pesquisa ou clique em "Novo Cliente"'}
                  </Typography>
                </Box>
              ) : (
                <ClienteList
                  clientes={clientes}
                  onDelete={handleDeleteConfirm}
                  onEdit={openEditModal}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  totalCount={total}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              )}
            </Box>
          </Paper>
        </Box>
      </Fade>

      <ClienteFormModal open={modalOpen} onClose={closeModal} cliente={selectedCliente} onSave={handleSave} />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar exclusão"
        description="Deseja realmente excluir este cliente? Esta ação não pode ser desfeita."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </Box>
  );
};

export default ClientesPage;
