import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import VeiculoList from '../components/veiculos/VeiculoList';
import VeiculoFormModal from '../components/veiculos/VeiculoFormModal';
import { veiculoService } from '../services/veiculoService';
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

  // Cache para evitar buscar o mesmo cliente múltiplas vezes
  const clienteCache = React.useRef<Map<string, { nome: string; notFound?: boolean }>>(new Map());

  const enrichVeiculos = async (veiculosData) => {
    // Enriquecer veículos com dados do cliente
    const enriched = await Promise.all(
      veiculosData.map(async (veiculo) => {
        try {
          // Se já tem o nome do cliente, retornar como está
          if (veiculo.clienteNome) {
            return veiculo;
          }

          const enrichedVeiculo = { ...veiculo };

          // Buscar cliente se não tiver o nome
          if (veiculo.clienteId) {
            // Verificar cache primeiro
            const cached = clienteCache.current.get(veiculo.clienteId);
            if (cached) {
              enrichedVeiculo.clienteNome = cached.notFound ? 'Cliente não encontrado' : cached.nome;
              return enrichedVeiculo;
            }

            // Validar se é um UUID válido antes de buscar
            const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(veiculo.clienteId);

            if (isValidUUID) {
              try {
                const cliente = await clienteService.getById(veiculo.clienteId);
                enrichedVeiculo.clienteNome = cliente.nome;
                // Adicionar ao cache
                clienteCache.current.set(veiculo.clienteId, { nome: cliente.nome });
              } catch (error: any) {
                // Silenciar erro 404 (cliente não encontrado) - é esperado em dev
                if (error.status !== 404) {
                  console.error(`Erro ao buscar cliente ${veiculo.clienteId}:`, error);
                }
                enrichedVeiculo.clienteNome = 'Cliente não encontrado';
                // Adicionar ao cache como não encontrado
                clienteCache.current.set(veiculo.clienteId, { nome: '', notFound: true });
              }
            } else {
              enrichedVeiculo.clienteNome = `ID inválido`;
              // Adicionar ao cache como inválido
              clienteCache.current.set(veiculo.clienteId, { nome: '', notFound: true });
            }
          }

          return enrichedVeiculo;
        } catch (error) {
          console.error('Erro ao enriquecer veículo:', error);
          return veiculo;
        }
      })
    );

    return enriched;
  };

  const fetchVeiculos = useCallback(
    async (p = 0, size = rowsPerPage) => {
      setLoading(true);
      try {
        const data = await veiculoService.getAll(p, size);

        let veiculosData = [];
        if (data && data.content) {
          veiculosData = data.content;
          setTotal(data.totalElements || data.total || 0);
        } else if (Array.isArray(data)) {
          veiculosData = data;
          setTotal(data.length);
        } else {
          setVeiculos([]);
          setTotal(0);
          setHasLoaded(true);
          setError(null);
          setLoading(false);
          return;
        }

        // Enriquecer com dados do cliente
        const enriched = await enrichVeiculos(veiculosData);
        setVeiculos(enriched);
        setHasLoaded(true);
        setError(null);
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
      console.log('VeiculosPage - handleSave:', {
        payloadId: payload?.id,
        selectedVeiculoId: selectedVeiculo?.id,
        idToUse,
        payload
      });

      if (idToUse) {
        console.log('VeiculosPage - Chamando veiculoService.update com ID:', idToUse);
        await veiculoService.update(idToUse, payload);
      } else {
        console.log('VeiculosPage - Chamando veiculoService.create');
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

  const actions = [
    {
      label: 'Novo Veículo',
      icon: <AddIcon />,
      onClick: openNewModal,
    },
    {
      label: 'Carregar Veículos',
      icon: <RefreshIcon />,
      onClick: () => fetchVeiculos(0, rowsPerPage),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Gerenciamento de Veículos"
        subtitle="Cadastre e gerencie todos os veículos dos clientes"
      />

      <ContentCard>
        <ActionBar actions={actions} />

        <Box sx={{ p: 3 }}>
          {loading ? (
            <LoadingState message="Carregando veículos..." />
          ) : error ? (
            <ErrorState message={error} onRetry={() => fetchVeiculos(0, rowsPerPage)} />
          ) : !veiculos || veiculos.length === 0 ? (
            <EmptyState
              title={hasLoaded ? 'Nenhum veículo encontrado' : 'Nenhum veículo carregado'}
              description={
                hasLoaded
                  ? 'Cadastre um novo veículo para começar'
                  : 'Clique em "Carregar Veículos" para ver a lista'
              }
              action={{
                label: 'Novo Veículo',
                icon: <AddIcon />,
                onClick: openNewModal,
              }}
            />
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
      </ContentCard>

      <VeiculoFormModal open={modalOpen} onClose={closeModal} veiculo={selectedVeiculo} onSave={handleSave} />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar exclusão"
        description="Deseja realmente excluir este veículo? Esta ação não pode ser desfeita."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </PageContainer>
  );
};

export default VeiculosPage;
