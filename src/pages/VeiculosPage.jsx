import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, Paper, Fade } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import VeiculoList from '../components/veiculos/VeiculoList';
import VeiculoFormModal from '../components/veiculos/VeiculoFormModal';
import { veiculoService } from '../services/veiculoService';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useNotification } from '../contexts/NotificationContext';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';

const VeiculosPage = () => {
  const { showSuccess, showError } = useNotification();
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVeiculo, setSelectedVeiculo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchVeiculos = useCallback(
    async (p = 0, size = rowsPerPage) => {
      setLoading(true);
      try {
        const data = await veiculoService.getAll(p, size);
        if (data && data.content) {
          setVeiculos(data.content);
          setTotal(data.totalElements || data.total || 0);
        } else if (Array.isArray(data)) {
          setVeiculos(data);
          setTotal(data.length);
        } else {
          setVeiculos([]);
          setTotal(0);
        }
        setHasLoaded(true);
      } catch (err) {
        console.error('Erro ao buscar veiculos', err);
        setError(ERROR_MESSAGES.LOAD_VEHICLES);
        showError(ERROR_MESSAGES.LOAD_VEHICLES);
      } finally {
        setLoading(false);
      }
    },
    [rowsPerPage, showError]
  );

  const openNewModal = () => {
    setSelectedVeiculo(null);
    setModalOpen(true);
  };

  const openEditModal = (v) => {
    setSelectedVeiculo(v);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedVeiculo(null);
    setModalOpen(false);
  };

  const handleSave = async (payload) => {
    try {
      const idToUse = (payload && payload.id) || (selectedVeiculo && selectedVeiculo.id);
      if (idToUse) {
        await veiculoService.update(idToUse, payload);
      } else {
        await veiculoService.create(payload);
      }
      showSuccess(SUCCESS_MESSAGES.SAVE_VEHICLE);
      await fetchVeiculos(0, rowsPerPage);
      setModalOpen(false);
    } catch (err) {
      console.error('Erro ao salvar veículo', err);
      setError(ERROR_MESSAGES.SAVE_VEHICLE);
      showError(ERROR_MESSAGES.SAVE_VEHICLE);
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
      await veiculoService.delete(toDeleteId);
      showSuccess(SUCCESS_MESSAGES.DELETE_VEHICLE);
      setConfirmOpen(false);
      setToDeleteId(null);
      await fetchVeiculos(page, rowsPerPage);
    } catch (err) {
      console.error('Erro ao excluir veículo', err);
      setError(ERROR_MESSAGES.DELETE_VEHICLE);
      showError(ERROR_MESSAGES.DELETE_VEHICLE);
    } finally {
      setDeleting(false);
    }
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
              Gerenciamento de Veículos
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
              Cadastre e gerencie todos os veículos dos clientes
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
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
                  Novo Veículo
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => fetchVeiculos(0, rowsPerPage)}
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
                  Carregar Veículos
                </Button>
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
                  <Typography color="text.secondary">Carregando veículos...</Typography>
                </Box>
              ) : error ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="error" gutterBottom>
                    {error}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => fetchVeiculos(0, rowsPerPage)}
                    sx={{ mt: 2, borderRadius: 2 }}
                  >
                    Tentar novamente
                  </Button>
                </Box>
              ) : !veiculos || veiculos.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {hasLoaded ? 'Nenhum veículo encontrado' : 'Nenhum veículo carregado'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {hasLoaded
                      ? 'Cadastre um novo veículo para começar'
                      : 'Clique em "Carregar Veículos" para ver a lista'}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={openNewModal}
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Novo Veículo
                  </Button>
                </Box>
              ) : (
                <VeiculoList
                  veiculos={veiculos}
                  onDelete={handleDeleteConfirm}
                  onEdit={openEditModal}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  totalCount={total}
                  onPageChange={(e, p) => {
                    setPage(p);
                    fetchVeiculos(p, rowsPerPage);
                  }}
                  onRowsPerPageChange={async (e) => {
                    const s = parseInt(e.target.value, 10);
                    setRowsPerPage(s);
                    setPage(0);
                    await fetchVeiculos(0, s);
                  }}
                />
              )}
            </Box>
          </Paper>
        </Box>
      </Fade>

      <VeiculoFormModal open={modalOpen} onClose={closeModal} veiculo={selectedVeiculo} onSave={handleSave} />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar exclusão"
        description="Deseja realmente excluir este veículo? Esta ação não pode ser desfeita."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </Box>
  );
};

export default VeiculosPage;
