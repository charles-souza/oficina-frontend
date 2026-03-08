import React, { useState, useCallback } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
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
import { reciboService } from '../services/reciboService';
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

  // Estado para pagamento
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [ordemParaPagamento, setOrdemParaPagamento] = useState<OrdemServico | null>(null);
  const [formaPagamento, setFormaPagamento] = useState('DINHEIRO');
  const [observacoesPagamento, setObservacoesPagamento] = useState('');
  const [receivingPayment, setReceivingPayment] = useState(false);

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

  const handleReceberPagamentoClick = (ordem: OrdemServico) => {
    setOrdemParaPagamento(ordem);
    setFormaPagamento('DINHEIRO');
    setObservacoesPagamento('');
    setPaymentModalOpen(true);
  };

  const handleReceberPagamento = async () => {
    if (!ordemParaPagamento?.id) return;

    setReceivingPayment(true);
    try {
      await reciboService.createFromOrdemServico(
        ordemParaPagamento.id,
        formaPagamento,
        observacoesPagamento || undefined
      );
      showSuccess('Pagamento recebido com sucesso! Recibo gerado e ordem entregue.');
      setPaymentModalOpen(false);
      setOrdemParaPagamento(null);
      await fetchOrdens(page, rowsPerPage);
    } catch (err: any) {
      console.error('Erro ao receber pagamento:', err);
      const errorMessage = err?.response?.data?.error || 'Erro ao processar pagamento';
      showError(errorMessage);
    } finally {
      setReceivingPayment(false);
    }
  };

  const handlePrint = async (ordem: OrdemServico) => {
    if (!ordem.id) return;

    try {
      const pdfBlob = await ordemServicoService.gerarPdf(ordem.id);

      // Criar URL temporária para o blob
      const pdfUrl = window.URL.createObjectURL(pdfBlob);

      // Abrir em nova aba
      window.open(pdfUrl, '_blank');

      // Limpar URL após um tempo
      setTimeout(() => {
        window.URL.revokeObjectURL(pdfUrl);
      }, 100);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      showError('Erro ao gerar PDF da ordem de serviço');
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
              onReceberPagamento={handleReceberPagamentoClick}
              onPrint={handlePrint}
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

      {/* Modal de Recebimento de Pagamento */}
      <Dialog
        open={paymentModalOpen}
        onClose={() => !receivingPayment && setPaymentModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <AttachMoneyIcon />
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Receber Pagamento
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              OS #{ordemParaPagamento?.id} - {ordemParaPagamento?.clienteNome}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Um recibo será gerado automaticamente e a ordem será marcada como <strong>ENTREGUE</strong>.
          </Alert>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography variant="body2" fontWeight={500} gutterBottom>
                Valor a Receber
              </Typography>
              <Typography variant="h5" color="primary.main" fontWeight={700}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(ordemParaPagamento?.valorTotal || 0)}
              </Typography>
            </Box>

            <TextField
              select
              label="Forma de Pagamento"
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
              fullWidth
              required
              disabled={receivingPayment}
            >
              <MenuItem value="DINHEIRO">Dinheiro</MenuItem>
              <MenuItem value="CARTAO_DEBITO">Cartão de Débito</MenuItem>
              <MenuItem value="CARTAO_CREDITO">Cartão de Crédito</MenuItem>
              <MenuItem value="PIX">PIX</MenuItem>
              <MenuItem value="TRANSFERENCIA">Transferência Bancária</MenuItem>
              <MenuItem value="CHEQUE">Cheque</MenuItem>
            </TextField>

            <TextField
              label="Observações"
              value={observacoesPagamento}
              onChange={(e) => setObservacoesPagamento(e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Adicione observações sobre o pagamento (opcional)"
              disabled={receivingPayment}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setPaymentModalOpen(false)}
            disabled={receivingPayment}
            sx={{ minWidth: 100 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleReceberPagamento}
            variant="contained"
            color="success"
            disabled={receivingPayment}
            startIcon={receivingPayment ? null : <AttachMoneyIcon />}
            sx={{ minWidth: 140 }}
          >
            {receivingPayment ? 'Processando...' : 'Confirmar Pagamento'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default OrdensServicoPage;
