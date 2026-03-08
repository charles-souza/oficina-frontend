import React, { useState, useCallback } from 'react';
import { Box, Dialog, DialogContent, Paper, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon } from '@mui/icons-material';
import ReciboForm from '../components/recibos/ReciboForm';
import { reciboService } from '../services/reciboService';
import {
  PageContainer,
  PageHeader,
  ActionBar,
  ContentCard,
  EmptyState,
  LoadingState,
} from '../components/common';
import { useNotification } from '../contexts/NotificationContext';
import { ERROR_MESSAGES } from '../constants';

const RecibosPage = () => {
  const { showSuccess, showError } = useNotification();
  const [recibos, setRecibos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecibo, setSelectedRecibo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
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

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este recibo?')) {
      try {
        await reciboService.delete(id);
        showSuccess('Recibo excluído com sucesso!');
        await fetchRecibos();
      } catch (err) {
        console.error('Erro ao excluir recibo', err);
        showError('Erro ao excluir recibo');
      }
    }
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
                      #{recibo.numero || recibo.id}
                    </Typography>
                    <Chip
                      label={recibo.status || 'Emitido'}
                      color="success"
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Cliente: {recibo.clienteNome}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Data: {new Date(recibo.dataEmissao).toLocaleDateString()}
                  </Typography>
                  <Typography variant="h5" color="primary" fontWeight={700} sx={{ mt: 2 }}>
                    R$ {recibo.valor?.toFixed(2)}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                    <Tooltip title="Imprimir">
                      <IconButton size="small" color="primary">
                        <PrintIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton size="small" color="primary" onClick={() => openEditModal(recibo)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton size="small" color="error" onClick={() => handleDelete(recibo.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      </ContentCard>

      <Dialog open={modalOpen} onClose={closeModal} maxWidth="md" fullWidth>
        <DialogContent>
          <ReciboForm recibo={selectedRecibo} onSave={handleSave} onCancel={closeModal} />
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default RecibosPage;
