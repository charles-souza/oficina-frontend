import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClienteList from '../components/clientes/ClienteList';
import ClienteFormModal from '../components/clientes/ClienteFormModal';
import { clienteService } from '../services/clienteService';
import {
  PageContainer,
  PageHeader,
  ActionBar,
  ContentCard,
  EmptyState,
  LoadingState,
  ErrorState,
  ConfirmDialog,
} from '../components/common';
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

  const handleSave = async (payload) => {
    try {
      const idToUse = (payload && payload.id) || (selectedCliente && selectedCliente.id);
      console.log('ClientesPage - handleSave:', {
        payloadId: payload?.id,
        selectedClienteId: selectedCliente?.id,
        idToUse,
        payload
      });

      if (idToUse) {
        console.log('ClientesPage - Chamando clienteService.update com ID:', idToUse);
        await clienteService.update(idToUse, payload);
      } else {
        console.log('ClientesPage - Chamando clienteService.create');
        await clienteService.create(payload);
      }
      showSuccess(SUCCESS_MESSAGES.SAVE_CLIENT);
      if (searchTerm.trim()) await fetchByName(searchTerm.trim());
      else await fetchAll(0, rowsPerPage);
      setHasSearched(true);
      setModalOpen(false);
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      setError(ERROR_MESSAGES.SAVE_CLIENT);
      showError(ERROR_MESSAGES.SAVE_CLIENT);
      throw err;
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

  const actions = [
    {
      label: 'Novo Cliente',
      icon: <AddIcon />,
      onClick: openNewModal,
    },
    {
      label: 'Carregar Clientes',
      icon: <RefreshIcon />,
      onClick: () => {
        setSearchTerm('');
        fetchAll(0, rowsPerPage);
        setHasSearched(true);
      },
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Gerenciamento de Clientes"
        subtitle="Cadastre e gerencie todos os seus clientes"
      />

      <ContentCard>
        <ActionBar actions={actions}>
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: 'flex',
              gap: 1,
              flexGrow: 1,
              ml: 'auto',
            }}
          >
            <TextField
              size="small"
              placeholder="Pesquisar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              sx={{
                maxWidth: 400,
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
        </ActionBar>

        <Box sx={{ p: 3 }}>
          {loading ? (
            <LoadingState message="Carregando clientes..." />
          ) : error ? (
            <ErrorState
              message={error}
              onRetry={() => {
                if (searchTerm.trim()) fetchByName(searchTerm.trim());
                else fetchAll(0, rowsPerPage);
              }}
            />
          ) : !clientes || clientes.length === 0 ? (
            <EmptyState
              title={hasSearched ? 'Nenhum cliente encontrado' : 'Nenhuma busca realizada'}
              description={
                hasSearched
                  ? 'Tente uma nova busca ou limpe os filtros'
                  : 'Use o campo de pesquisa ou clique em "Novo Cliente"'
              }
            />
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
      </ContentCard>

      <ClienteFormModal open={modalOpen} onClose={closeModal} cliente={selectedCliente} onSave={handleSave} />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar exclusão"
        description="Deseja realmente excluir este cliente? Esta ação não pode ser desfeita."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </PageContainer>
  );
};

export default ClientesPage;
