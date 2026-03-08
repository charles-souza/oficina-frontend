import React, { useState, useCallback } from 'react';
import { Box, Paper, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon } from '@mui/icons-material';
import ReciboFormModal from '../components/recibos/ReciboFormModal';
import { reciboService } from '../services/reciboService';
import {
  PageContainer,
  PageHeader,
  ActionBar,
  ContentCard,
  EmptyState,
  LoadingState,
  ConfirmDialog,
} from '../components/common';
import { useNotification } from '../contexts/NotificationContext';
import { ERROR_MESSAGES } from '../constants';

const RecibosPage = () => {
  const { showSuccess, showError } = useNotification();
  const [recibos, setRecibos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecibo, setSelectedRecibo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchRecibos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await reciboService.getAll();
      if (Array.isArray(data)) setRecibos(data);
      else setRecibos([]);
      setHasLoaded(true);
    } catch (err) {
      console.error('Erro ao buscar recibos', err);
      showError(ERROR_MESSAGES.GENERIC);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const openNewModal = () => {
    setSelectedRecibo(null);
    setModalOpen(true);
  };

  const openEditModal = (recibo) => {
    setSelectedRecibo(recibo);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRecibo(null);
    setModalOpen(false);
  };

  const handleSave = async () => {
    await fetchRecibos();
    closeModal();
  };

  const handleDeleteConfirm = (id) => {
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!toDeleteId) return;
    setDeleting(true);
    try {
      await reciboService.delete(toDeleteId);
      showSuccess('Recibo excluído com sucesso!');
      setConfirmOpen(false);
      setToDeleteId(null);
      await fetchRecibos();
    } catch (err) {
      console.error('Erro ao excluir recibo', err);
      showError('Erro ao excluir recibo');
    } finally {
      setDeleting(false);
    }
  };

  const handlePrint = (recibo) => {
    // Placeholder para funcionalidade de impressão
    // Pode ser implementado com window.print() ou geração de PDF
    showError('Funcionalidade de impressão em desenvolvimento');
  };

  const actions = [
    {
      label: 'Novo Recibo',
      icon: <AddIcon />,
      onClick: openNewModal,
    },
    {
      label: 'Carregar Recibos',
      icon: <RefreshIcon />,
      onClick: fetchRecibos,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Gerenciamento de Recibos"
        subtitle="Gere e gerencie recibos de pagamento"
      />

      <ContentCard>
        <ActionBar actions={actions} />

        <Box sx={{ p: 3 }}>
          {loading ? (
            <LoadingState message="Carregando recibos..." />
          ) : !recibos || recibos.length === 0 ? (
            <EmptyState
              title={hasLoaded ? 'Nenhum recibo encontrado' : 'Nenhum recibo carregado'}
              description={
                hasLoaded
                  ? 'Gere um novo recibo para começar'
                  : 'Clique em "Carregar Recibos" para ver a lista'
              }
              action={{
                label: 'Novo Recibo',
                icon: <AddIcon />,
                onClick: openNewModal,
              }}
            />
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                },
                gap: 3,
              }}
            >
              {recibos.map((recibo) => (
                <Paper
                  key={recibo.id}
                  elevation={0}
                  sx={{
                    p: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 3,
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Recibo #{recibo.id?.substring(0, 8)}
                    </Typography>
                    <Chip label="Emitido" color="success" size="small" />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Cliente:</strong> {recibo.clienteNome || 'Não informado'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Data:</strong>{' '}
                    {recibo.dataEmissao
                      ? new Date(recibo.dataEmissao).toLocaleDateString('pt-BR')
                      : '-'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Forma de Pagamento:</strong>{' '}
                    {recibo.formaPagamento?.replace(/_/g, ' ') || 'Não informada'}
                  </Typography>

                  {recibo.descricao && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      sx={{
                        mt: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {recibo.descricao}
                    </Typography>
                  )}

                  <Typography variant="h5" color="primary" fontWeight={700} sx={{ mt: 2 }}>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(recibo.valorPago || 0)}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                    <Tooltip title="Imprimir">
                      <IconButton
                        size="small"
                        onClick={() => handlePrint(recibo)}
                        sx={{
                          color: 'primary.main',
                          '&:hover': { bgcolor: 'primary.50' },
                        }}
                      >
                        <PrintIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => openEditModal(recibo)}
                        sx={{
                          color: 'info.main',
                          '&:hover': { bgcolor: 'info.50' },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteConfirm(recibo.id)}
                        sx={{
                          color: 'error.main',
                          '&:hover': { bgcolor: 'error.50' },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      </ContentCard>

      <ReciboFormModal
        open={modalOpen}
        onClose={closeModal}
        recibo={selectedRecibo}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar exclusão"
        description="Deseja realmente excluir este recibo? Esta ação não pode ser desfeita."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </PageContainer>
  );
};

export default RecibosPage;
