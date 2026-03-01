import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, Paper, Fade } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import OrcamentosList from '../components/orcamentos/OrcamentosList';
import OrcamentoFormModal from '../components/orcamentos/OrcamentoFormModal';
import { orcamentoService } from '../services/orcamentoService';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useNotification } from '../contexts/NotificationContext';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';

const OrcamentosPage = () => {
  const { showSuccess, showError } = useNotification();
  const [orcamentos, setOrcamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedOrcamento, setSelectedOrcamento] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hasLoaded, setHasLoaded] = useState(false);
  const total = orcamentos.length;

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orcamentoService.getAll();
      if (Array.isArray(data)) setOrcamentos(data);
      else setOrcamentos([]);
      setHasLoaded(true);
    } catch (err) {
      console.error('Erro ao buscar orçamentos', err);
      showError(ERROR_MESSAGES.LOAD_QUOTES);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const openNewModal = () => {
    setSelectedOrcamento(null);
    setModalOpen(true);
  };

  const openEditModal = (o) => {
    setSelectedOrcamento(o);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrcamento(null);
    setModalOpen(false);
  };

  const handleSave = async (payload) => {
    try {
      if (payload.id) await orcamentoService.update(payload.id, payload);
      else await orcamentoService.create(payload);
      showSuccess(SUCCESS_MESSAGES.SAVE_QUOTE);
      await fetchAll();
      setModalOpen(false);
    } catch (err) {
      console.error('Erro ao salvar orçamento', err);
      showError(ERROR_MESSAGES.SAVE_QUOTE);
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
      await orcamentoService.delete(toDeleteId);
      showSuccess(SUCCESS_MESSAGES.DELETE_QUOTE);
      setConfirmOpen(false);
      setToDeleteId(null);
      await fetchAll();
    } catch (err) {
      console.error('Erro ao excluir orçamento', err);
      showError(ERROR_MESSAGES.DELETE_QUOTE);
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
              Gerenciamento de Orçamentos
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
              Crie e gerencie orçamentos para seus clientes
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
                  Novo Orçamento
                </Button>

                <Button
                  variant="outlined"
                  onClick={fetchAll}
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
                  Carregar Orçamentos
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
                  <Typography color="text.secondary">Carregando orçamentos...</Typography>
                </Box>
              ) : !orcamentos || orcamentos.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {hasLoaded ? 'Nenhum orçamento encontrado' : 'Nenhum orçamento carregado'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {hasLoaded
                      ? 'Crie um novo orçamento para começar'
                      : 'Clique em "Carregar Orçamentos" para ver a lista'}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={openNewModal}
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Novo Orçamento
                  </Button>
                </Box>
              ) : (
                <OrcamentosList
                  orcamentos={orcamentos}
                  onEdit={openEditModal}
                  onDelete={handleDeleteConfirm}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  totalCount={total}
                  onPageChange={(e, p) => {
                    setPage(p);
                  }}
                  onRowsPerPageChange={async (e) => {
                    const s = parseInt(e.target.value, 10);
                    setRowsPerPage(s);
                  }}
                />
              )}
            </Box>
          </Paper>
        </Box>
      </Fade>

      <OrcamentoFormModal open={modalOpen} onClose={closeModal} orcamento={selectedOrcamento} onSave={handleSave} />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar exclusão"
        description="Deseja realmente excluir este orçamento? Esta ação não pode ser desfeita."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </Box>
  );
};

export default OrcamentosPage;
