import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, Paper, Fade, Dialog, DialogContent, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ReciboForm from '../components/recibos/ReciboForm';
import { reciboService } from '../services/reciboService';
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
              Gerenciamento de Recibos
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
              Gere e gerencie recibos de pagamento
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
                  Novo Recibo
                </Button>

                <Button
                  variant="outlined"
                  onClick={fetchRecibos}
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
                  Carregar Recibos
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
                  <Typography color="text.secondary">Carregando recibos...</Typography>
                </Box>
              ) : !recibos || recibos.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {hasLoaded ? 'Nenhum recibo encontrado' : 'Nenhum recibo carregado'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {hasLoaded
                      ? 'Gere um novo recibo para começar'
                      : 'Clique em "Carregar Recibos" para ver a lista'}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={openNewModal}
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Novo Recibo
                  </Button>
                </Box>
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
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Recibo #{recibo.id}
                        </Typography>
                        <Chip
                          label={recibo.formaPagamento}
                          size="small"
                          color="primary"
                          sx={{ borderRadius: 1 }}
                        />
                      </Box>

                      <Typography variant="h5" color="primary" fontWeight={700} sx={{ mb: 1 }}>
                        R$ {recibo.valorPago?.toFixed(2) || '0.00'}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        📅 {recibo.dataEmissao ? new Date(recibo.dataEmissao).toLocaleDateString('pt-BR') : '-'}
                      </Typography>

                      {recibo.descricao && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {recibo.descricao}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => openEditModal(recibo)}
                          sx={{ borderRadius: 1, flex: 1 }}
                        >
                          Editar
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(recibo.id)}
                          sx={{ borderRadius: 1, flex: 1 }}
                        >
                          Excluir
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Fade>

      {/* Modal com formulário */}
      <Dialog open={modalOpen} onClose={closeModal} maxWidth="md" fullWidth>
        <DialogContent>
          <ReciboForm recibo={selectedRecibo} onSave={handleSave} onCancel={closeModal} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RecibosPage;
