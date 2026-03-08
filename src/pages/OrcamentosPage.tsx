import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import OrcamentosList from '../components/orcamentos/OrcamentosList';
import OrcamentoFormModal from '../components/orcamentos/OrcamentoFormModal';
import { orcamentoService } from '../services/orcamentoService';
import { clienteService } from '../services/clienteService';
import { veiculoService } from '../services/veiculoService';
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

  // Cache para evitar buscar o mesmo cliente/veículo múltiplas vezes
  const clienteCache = React.useRef<Map<string, { nome: string; notFound?: boolean }>>(new Map());
  const veiculoCache = React.useRef<Map<string, { placa: string; modelo: string; notFound?: boolean }>>(new Map());

  const enrichOrcamentos = async (orcamentosData) => {
    // Enriquecer orçamentos com dados de cliente e veículo
    const enriched = await Promise.all(
      orcamentosData.map(async (orc) => {
        try {
          // Se já tem os campos, retornar como está
          if (orc.clienteNome && orc.veiculoPlaca && orc.valorTotal !== undefined) {
            return orc;
          }

          const enrichedOrc = { ...orc };

          // Buscar cliente se não tiver o nome
          if (!orc.clienteNome && orc.clienteId) {
            // Verificar cache primeiro
            const cached = clienteCache.current.get(orc.clienteId);
            if (cached) {
              enrichedOrc.clienteNome = cached.notFound ? 'Cliente não encontrado' : cached.nome;
            } else {
              // Validar se é um UUID válido antes de buscar
              const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orc.clienteId);

              if (isValidUUID) {
                try {
                  const cliente = await clienteService.getById(orc.clienteId);
                  enrichedOrc.clienteNome = cliente.nome;
                  clienteCache.current.set(orc.clienteId, { nome: cliente.nome });
                } catch (error: any) {
                  // Silenciar erro 404 (cliente não encontrado) - é esperado em dev
                  if (error.status !== 404) {
                    console.error(`Erro ao buscar cliente ${orc.clienteId}:`, error);
                  }
                  enrichedOrc.clienteNome = 'Cliente não encontrado';
                  clienteCache.current.set(orc.clienteId, { nome: '', notFound: true });
                }
              } else {
                enrichedOrc.clienteNome = `ID inválido: ${orc.clienteId}`;
                clienteCache.current.set(orc.clienteId, { nome: '', notFound: true });
              }
            }
          }

          // Buscar veículo se não tiver a placa
          if ((!orc.veiculoPlaca || !orc.veiculoModelo) && orc.veiculoId) {
            // Verificar cache primeiro
            const cached = veiculoCache.current.get(orc.veiculoId);
            if (cached) {
              enrichedOrc.veiculoPlaca = cached.notFound ? 'Veículo não encontrado' : cached.placa;
              enrichedOrc.veiculoModelo = cached.notFound ? '' : cached.modelo;
            } else {
              // Validar se é um UUID válido antes de buscar
              const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orc.veiculoId);

              if (isValidUUID) {
                try {
                  const veiculo = await veiculoService.getById(orc.veiculoId);
                  enrichedOrc.veiculoPlaca = veiculo.placa;
                  enrichedOrc.veiculoModelo = `${veiculo.marca} ${veiculo.modelo}`;
                  veiculoCache.current.set(orc.veiculoId, {
                    placa: veiculo.placa,
                    modelo: `${veiculo.marca} ${veiculo.modelo}`
                  });
                } catch (error: any) {
                  // Silenciar erro 404 (veículo não encontrado) - é esperado em dev
                  if (error.status !== 404) {
                    console.error(`Erro ao buscar veículo ${orc.veiculoId}:`, error);
                  }
                  enrichedOrc.veiculoPlaca = 'Veículo não encontrado';
                  veiculoCache.current.set(orc.veiculoId, { placa: '', modelo: '', notFound: true });
                }
              } else {
                enrichedOrc.veiculoPlaca = `ID inválido: ${orc.veiculoId}`;
                veiculoCache.current.set(orc.veiculoId, { placa: '', modelo: '', notFound: true });
              }
            }
          }

          // Calcular valorTotal se não tiver
          if (orc.valorTotal === undefined && orc.itens && Array.isArray(orc.itens)) {
            const subtotal = orc.itens.reduce((sum, item) => {
              return sum + ((item.quantidade || 0) * (item.valorUnitario || 0));
            }, 0);
            enrichedOrc.valorTotal = subtotal - (orc.desconto || 0);
          }

          // Garantir que status existe
          if (!enrichedOrc.status) {
            enrichedOrc.status = 'PENDENTE';
          }

          return enrichedOrc;
        } catch (error) {
          console.error('Erro ao enriquecer orçamento:', error);
          return orc;
        }
      })
    );

    return enriched;
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orcamentoService.getAll();
      console.log('Dados originais da API:', data);

      if (Array.isArray(data)) {
        const enriched = await enrichOrcamentos(data);
        console.log('Dados enriquecidos:', enriched);
        setOrcamentos(enriched);
      } else {
        setOrcamentos([]);
      }
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
      console.log('handleSave recebeu payload:', payload);

      if (payload.id) {
        console.log('Atualizando orçamento ID:', payload.id);
        await orcamentoService.update(payload.id, payload);
      } else {
        console.log('Criando novo orçamento');
        await orcamentoService.create(payload);
      }

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

  const actions = [
    {
      label: 'Novo Orçamento',
      icon: <AddIcon />,
      onClick: openNewModal,
    },
    {
      label: 'Carregar Orçamentos',
      icon: <RefreshIcon />,
      onClick: fetchAll,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Gerenciamento de Orçamentos"
        subtitle="Crie e gerencie orçamentos para seus clientes"
      />

      <ContentCard>
        <ActionBar actions={actions} />

        <Box sx={{ p: 3 }}>
          {loading ? (
            <LoadingState message="Carregando orçamentos..." />
          ) : !orcamentos || orcamentos.length === 0 ? (
            <EmptyState
              title={hasLoaded ? 'Nenhum orçamento encontrado' : 'Nenhum orçamento carregado'}
              description={
                hasLoaded
                  ? 'Crie um novo orçamento para começar'
                  : 'Clique em "Carregar Orçamentos" para ver a lista'
              }
              action={{
                label: 'Novo Orçamento',
                icon: <AddIcon />,
                onClick: openNewModal,
              }}
            />
          ) : (
            <OrcamentosList
              orcamentos={orcamentos}
              onDelete={handleDeleteConfirm}
              onEdit={openEditModal}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={total}
              onPageChange={(e, p) => setPage(p)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          )}
        </Box>
      </ContentCard>

      <OrcamentoFormModal open={modalOpen} onClose={closeModal} orcamento={selectedOrcamento} onSave={handleSave} />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar exclusão"
        description="Deseja realmente excluir este orçamento? Esta ação não pode ser desfeita."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </PageContainer>
  );
};

export default OrcamentosPage;
