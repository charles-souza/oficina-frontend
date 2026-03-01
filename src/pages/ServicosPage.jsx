import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, Paper, Fade, Dialog, DialogContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ServicoForm from '../components/servicos/ServicoForm';
import { servicoService } from '../services/servicoService';
import { useNotification } from '../contexts/NotificationContext';
import { ERROR_MESSAGES } from '../constants';

const ServicosPage = () => {
  const { showSuccess, showError } = useNotification();
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedServico, setSelectedServico] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchServicos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await servicoService.getAll();
      if (Array.isArray(data)) setServicos(data);
      else setServicos([]);
      setHasLoaded(true);
    } catch (err) {
      console.error('Erro ao buscar serviços', err);
      showError(ERROR_MESSAGES.GENERIC);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const openNewModal = () => {
    setSelectedServico(null);
    setModalOpen(true);
  };

  const openEditModal = (servico) => {
    setSelectedServico(servico);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedServico(null);
    setModalOpen(false);
  };

  const handleSave = async () => {
    await fetchServicos();
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este serviço?')) {
      try {
        await servicoService.delete(id);
        showSuccess('Serviço excluído com sucesso!');
        await fetchServicos();
      } catch (err) {
        console.error('Erro ao excluir serviço', err);
        showError('Erro ao excluir serviço');
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
              Gerenciamento de Serviços
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
              Cadastre e gerencie o catálogo de serviços
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
                  Novo Serviço
                </Button>

                <Button
                  variant="outlined"
                  onClick={fetchServicos}
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
                  Carregar Serviços
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
                  <Typography color="text.secondary">Carregando serviços...</Typography>
                </Box>
              ) : !servicos || servicos.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {hasLoaded ? 'Nenhum serviço encontrado' : 'Nenhum serviço carregado'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {hasLoaded
                      ? 'Cadastre um novo serviço para começar'
                      : 'Clique em "Carregar Serviços" para ver a lista'}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={openNewModal}
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Novo Serviço
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                    },
                    gap: 3,
                  }}
                >
                  {servicos.map((servico) => (
                    <Paper
                      key={servico.id}
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
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {servico.descricao}
                      </Typography>
                      <Typography variant="h5" color="primary" fontWeight={700} sx={{ mb: 1 }}>
                        R$ {servico.preco?.toFixed(2) || '0.00'}
                      </Typography>
                      {servico.tempoEstimadoMinutos && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          ⏱️ {servico.tempoEstimadoMinutos} minutos
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => openEditModal(servico)}
                          sx={{ borderRadius: 1 }}
                        >
                          Editar
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(servico.id)}
                          sx={{ borderRadius: 1 }}
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
      <Dialog open={modalOpen} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogContent>
          <ServicoForm servico={selectedServico} onSave={handleSave} onCancel={closeModal} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ServicosPage;
