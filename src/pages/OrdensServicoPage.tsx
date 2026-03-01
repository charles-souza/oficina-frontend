import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { Add, Refresh } from '@mui/icons-material';
import OrdemServicoList from '../components/ordens-servico/OrdemServicoList';
import OrdemServicoFormModal from '../components/ordens-servico/OrdemServicoFormModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useNotification } from '../contexts/NotificationContext';
import { ordemServicoService } from '../services/ordemServicoService';
import {
  OrdemServico,
  OrdemServicoRequest,
  OrdemServicoStatus,
} from '../types/api';
import { usePageTitle } from '../hooks/usePageTitle';

const OrdensServicoPage: React.FC = () => {
  usePageTitle('Ordens de Serviço');

  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrdem, setSelectedOrdem] = useState<OrdemServico | null>(null);
  const [ordemToDelete, setOrdemToDelete] = useState<number | null>(null);

  // Paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Filtro por status
  const [statusFilter, setStatusFilter] = useState<OrdemServicoStatus | ''>('');

  const { showNotification } = useNotification();

  useEffect(() => {
    loadOrdens();
  }, [page, rowsPerPage, statusFilter]);

  const loadOrdens = async () => {
    setLoading(true);
    try {
      const response = await ordemServicoService.getAll(
        page,
        rowsPerPage,
        statusFilter || undefined
      );
      console.log('Response ordens:', response);
      console.log('Content:', response.content);
      setOrdens(response.content);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Erro ao carregar ordens:', error);
      showNotification('Erro ao carregar ordens de serviço', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (ordem?: OrdemServico) => {
    if (ordem) {
      setSelectedOrdem(ordem);
    } else {
      setSelectedOrdem(null);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrdem(null);
  };

  const handleSubmit = async (values: OrdemServicoRequest) => {
    try {
      if (selectedOrdem?.id) {
        await ordemServicoService.update(selectedOrdem.id, values);
        showNotification('Ordem de serviço atualizada com sucesso!', 'success');
      } else {
        await ordemServicoService.create(values);
        showNotification('Ordem de serviço criada com sucesso!', 'success');
      }
      handleCloseModal();
      loadOrdens();
    } catch (error) {
      showNotification('Erro ao salvar ordem de serviço', 'error');
    }
  };

  const handleDelete = (id: number) => {
    setOrdemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (ordemToDelete) {
      try {
        await ordemServicoService.delete(ordemToDelete);
        showNotification('Ordem de serviço excluída com sucesso!', 'success');
        loadOrdens();
      } catch (error) {
        showNotification('Erro ao excluir ordem de serviço', 'error');
      }
    }
    setDeleteDialogOpen(false);
    setOrdemToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setOrdemToDelete(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
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
          Ordens de Serviço
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Gerencie as ordens de serviço da oficina
        </Typography>
      </Paper>

      {/* Ações e Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filtrar por Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as OrdemServicoStatus | '');
                  setPage(0);
                }}
                label="Filtrar por Status"
              >
                <MenuItem value="">
                  <em>Todos</em>
                </MenuItem>
                {Object.values(OrdemServicoStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.replace(/_/g, ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6} md={8}>
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadOrdens}
                disabled={loading}
              >
                Atualizar
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenModal()}
              >
                Nova Ordem
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Lista de Ordens */}
      <OrdemServicoList
        ordens={ordens}
        loading={loading}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        page={page}
        rowsPerPage={rowsPerPage}
        totalElements={totalElements}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Modal de Formulário */}
      <OrdemServicoFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialValues={
          selectedOrdem
            ? {
                clienteId: selectedOrdem.clienteId,
                veiculoId: selectedOrdem.veiculoId,
                orcamentoId: selectedOrdem.orcamentoId,
                dataAbertura: selectedOrdem.dataAbertura,
                dataConclusao: selectedOrdem.dataConclusao,
                dataEntrega: selectedOrdem.dataEntrega,
                descricao: selectedOrdem.descricao,
                observacoes: selectedOrdem.observacoes,
                desconto: selectedOrdem.desconto,
                itens: selectedOrdem.itens,
              }
            : undefined
        }
      />

      {/* Dialog de Confirmação */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta ordem de serviço?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Box>
  );
};

export default OrdensServicoPage;
