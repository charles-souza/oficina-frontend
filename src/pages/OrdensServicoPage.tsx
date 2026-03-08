import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import OrdemServicoList from '../components/ordens-servico/OrdemServicoList';
import OrdemServicoFormModal from '../components/ordens-servico/OrdemServicoFormModal';
import {
  PageContainer,
  PageHeader,
  ActionBar,
  ContentCard,
  LoadingState,
  EmptyState,
  ConfirmDialog,
} from '../components/common';
import { useNotification } from '../contexts/NotificationContext';
import { ordemServicoService } from '../services/ordemServicoService';
import { clienteService } from '../services/clienteService';
import { veiculoService } from '../services/veiculoService';
import { OrdemServico, OrdemServicoRequest, OrdemServicoStatus } from '../types/api';
import { ERROR_MESSAGES } from '../constants';

const OrdensServicoPage: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOrdem, setSelectedOrdem] = useState<OrdemServico | null>(null);
  const [toDeleteId, setToDeleteId] = useState<number | string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Cache para evitar buscar o mesmo cliente/veículo múltiplas vezes
  const clienteCache = React.useRef<Map<string, { nome: string; notFound?: boolean }>>(new Map());
  const veiculoCache = React.useRef<Map<string, { placa: string; modelo: string; notFound?: boolean }>>(
    new Map()
  );

  const enrichOrdens = async (ordensData: OrdemServico[]) => {
    const enriched = await Promise.all(
      ordensData.map(async (ordem) => {
        try {
          const enrichedOrdem = { ...ordem };

          // Buscar cliente se não tiver o nome
          if (!ordem.clienteNome && ordem.clienteId) {
            const cached = clienteCache.current.get(ordem.clienteId);
            if (cached) {
              enrichedOrdem.clienteNome = cached.notFound ? 'Cliente não encontrado' : cached.nome;
            } else {
              const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
                ordem.clienteId
              );
              if (isValidUUID) {
                try {
                  const cliente = await clienteService.getById(ordem.clienteId);
                  enrichedOrdem.clienteNome = cliente.nome;
                  clienteCache.current.set(ordem.clienteId, { nome: cliente.nome });
                } catch (error: any) {
                  if (error.status !== 404) {
                    console.error(`Erro ao buscar cliente ${ordem.clienteId}:`, error);
                  }
                  enrichedOrdem.clienteNome = 'Cliente não encontrado';
                  clienteCache.current.set(ordem.clienteId, { nome: '', notFound: true });
                }
              } else {
                enrichedOrdem.clienteNome = `ID inválido`;
                clienteCache.current.set(ordem.clienteId, { nome: '', notFound: true });
              }
            }
          }

          // Buscar veículo se não tiver a placa
          if ((!ordem.veiculoPlaca || !ordem.veiculoModelo) && ordem.veiculoId) {
            const cached = veiculoCache.current.get(ordem.veiculoId);
            if (cached) {
              enrichedOrdem.veiculoPlaca = cached.notFound ? 'Veículo não encontrado' : cached.placa;
              enrichedOrdem.veiculoModelo = cached.notFound ? '' : cached.modelo;
            } else {
              const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
                ordem.veiculoId
              );
              if (isValidUUID) {
                try {
                  const veiculo = await veiculoService.getById(ordem.veiculoId);
                  enrichedOrdem.veiculoPlaca = veiculo.placa;
                  enrichedOrdem.veiculoModelo = `${veiculo.marca} ${veiculo.modelo}`;
                  veiculoCache.current.set(ordem.veiculoId, {
                    placa: veiculo.placa,
                    modelo: `${veiculo.marca} ${veiculo.modelo}`,
                  });
                } catch (error: any) {
                  if (error.status !== 404) {
                    console.error(`Erro ao buscar veículo ${ordem.veiculoId}:`, error);
                  }
                  enrichedOrdem.veiculoPlaca = 'Veículo não encontrado';
                  veiculoCache.current.set(ordem.veiculoId, { placa: '', modelo: '', notFound: true });
                }
              } else {
                enrichedOrdem.veiculoPlaca = `ID inválido`;
                veiculoCache.current.set(ordem.veiculoId, { placa: '', modelo: '', notFound: true });
              }
            }
          }

          return enrichedOrdem;
        } catch (error) {
          console.error('Erro ao enriquecer ordem:', error);
          return ordem;
        }
      })
    );

    return enriched;
  };

  const fetchOrdens = useCallback(
    async (p = 0, size = rowsPerPage) => {
      setLoading(true);
      try {
        const response = await ordemServicoService.getAll(p, size);

        let ordensData: OrdemServico[] = [];
        if (response && response.content) {
          ordensData = response.content;
          setTotal(response.totalElements || 0);
        } else if (Array.isArray(response)) {
          ordensData = response;
          setTotal(response.length);
        } else {
          setOrdens([]);
          setTotal(0);
          setHasLoaded(true);
          setLoading(false);
          return;
        }

        const enriched = await enrichOrdens(ordensData);
        setOrdens(enriched);
        setHasLoaded(true);
      } catch (err) {
        console.error('Erro ao buscar ordens:', err);
        showError('Erro ao carregar ordens de serviço');
      } finally {
        setLoading(false);
      }
    },
    [rowsPerPage, showError]
  );

  const openNewModal = () => {
    setSelectedOrdem(null);
    setModalOpen(true);
  };

  const openEditModal = (ordem: OrdemServico) => {
    setSelectedOrdem(ordem);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrdem(null);
    setModalOpen(false);
  };

  const handleSave = async (values: OrdemServicoRequest) => {
    try {
      if (selectedOrdem?.id) {
        await ordemServicoService.update(selectedOrdem.id as number, values);
        showSuccess('Ordem de serviço atualizada com sucesso!');
      } else {
        await ordemServicoService.create(values);
        showSuccess('Ordem de serviço criada com sucesso!');
      }
      closeModal();
      await fetchOrdens(page, rowsPerPage);
    } catch (err) {
      console.error('Erro ao salvar ordem:', err);
      showError('Erro ao salvar ordem de serviço');
      throw err;
    }
  };

  const handleDeleteConfirm = (id: number | string) => {
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!toDeleteId) return;
    setDeleting(true);
    try {
      await ordemServicoService.delete(toDeleteId as number);
      showSuccess('Ordem de serviço excluída com sucesso!');
      setConfirmOpen(false);
      setToDeleteId(null);
      await fetchOrdens(page, rowsPerPage);
    } catch (err) {
      console.error('Erro ao excluir ordem:', err);
      showError('Erro ao excluir ordem de serviço');
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (id: number | string, status: OrdemServicoStatus) => {
    try {
      await ordemServicoService.updateStatus(id as number, status);
      showSuccess(`Status alterado para ${status.replace(/_/g, ' ')}`);
      await fetchOrdens(page, rowsPerPage);
    } catch (err) {
      console.error('Erro ao alterar status:', err);
      showError('Erro ao alterar status da ordem de serviço');
    }
  };

  const actions = [
    {
      label: 'Nova Ordem',
      icon: <AddIcon />,
      onClick: openNewModal,
    },
    {
      label: 'Carregar Ordens',
      icon: <RefreshIcon />,
      onClick: () => fetchOrdens(0, rowsPerPage),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Gerenciamento de Ordens de Serviço"
        subtitle="Gerencie o ciclo completo das ordens de serviço"
      />

      <ContentCard>
        <ActionBar actions={actions} />

        <Box sx={{ p: 3 }}>
          {loading ? (
            <LoadingState message="Carregando ordens de serviço..." />
          ) : !ordens || ordens.length === 0 ? (
            <EmptyState
              title={hasLoaded ? 'Nenhuma ordem encontrada' : 'Nenhuma ordem carregada'}
              description={
                hasLoaded
                  ? 'Crie uma nova ordem de serviço para começar'
                  : 'Clique em "Carregar Ordens" para ver a lista'
              }
              action={{
                label: 'Nova Ordem',
                icon: <AddIcon />,
                onClick: openNewModal,
              }}
            />
          ) : (
            <OrdemServicoList
              ordens={ordens}
              onEdit={openEditModal}
              onDelete={handleDeleteConfirm}
              onStatusChange={handleStatusChange}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={total}
              onPageChange={(e, p) => {
                setPage(p);
                fetchOrdens(p, rowsPerPage);
              }}
              onRowsPerPageChange={(e) => {
                const s = parseInt(e.target.value, 10);
                setRowsPerPage(s);
                setPage(0);
                fetchOrdens(0, s);
              }}
            />
          )}
        </Box>
      </ContentCard>

      <OrdemServicoFormModal
        open={modalOpen}
        onClose={closeModal}
        ordem={selectedOrdem || undefined}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar exclusão"
        description="Deseja realmente excluir esta ordem de serviço? Esta ação não pode ser desfeita."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </PageContainer>
  );
};

export default OrdensServicoPage;
