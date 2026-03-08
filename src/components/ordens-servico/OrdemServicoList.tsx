import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Print as PrintIcon,
  MoreVert as MoreVertIcon,
  Schedule as ScheduleIcon,
  Build as BuildIcon,
  HourglassEmpty as HourglassIcon,
  CheckCircle as CheckCircleIcon,
  LocalShipping as LocalShippingIcon,
  Cancel as CancelIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { OrdemServico, OrdemServicoStatus } from '../../types/api';

interface OrdemServicoListProps {
  ordens: OrdemServico[];
  onEdit: (ordem: OrdemServico) => void;
  onDelete: (id: number | string) => void;
  onStatusChange?: (id: number | string, status: OrdemServicoStatus) => void;
  onReceberPagamento?: (ordem: OrdemServico) => void;
  onPrint?: (ordem: OrdemServico) => void;
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (event: unknown, page: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Configuração de status com cores e ícones
const getStatusConfig = (status: OrdemServicoStatus) => {
  const configs = {
    [OrdemServicoStatus.ABERTA]: {
      label: 'Aberta',
      color: 'info' as const,
      icon: <ScheduleIcon fontSize="small" />,
    },
    [OrdemServicoStatus.EM_ANDAMENTO]: {
      label: 'Em Andamento',
      color: 'primary' as const,
      icon: <BuildIcon fontSize="small" />,
    },
    [OrdemServicoStatus.AGUARDANDO_PECA]: {
      label: 'Aguardando Peça',
      color: 'warning' as const,
      icon: <HourglassIcon fontSize="small" />,
    },
    [OrdemServicoStatus.PRONTA]: {
      label: 'Pronta',
      color: 'success' as const,
      icon: <CheckCircleIcon fontSize="small" />,
    },
    [OrdemServicoStatus.ENTREGUE]: {
      label: 'Entregue',
      color: 'default' as const,
      icon: <LocalShippingIcon fontSize="small" />,
    },
    [OrdemServicoStatus.CANCELADA]: {
      label: 'Cancelada',
      color: 'error' as const,
      icon: <CancelIcon fontSize="small" />,
    },
  };
  return configs[status] || { label: status, color: 'default' as const, icon: null };
};

const OrdemServicoList: React.FC<OrdemServicoListProps> = ({
  ordens = [],
  onEdit,
  onDelete,
  onStatusChange,
  onReceberPagamento,
  onPrint,
  page = 0,
  rowsPerPage = 10,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedOrdem, setSelectedOrdem] = React.useState<OrdemServico | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, ordem: OrdemServico) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrdem(ordem);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrdem(null);
  };

  const handleStatusChange = (status: OrdemServicoStatus) => {
    if (selectedOrdem && onStatusChange) {
      onStatusChange(selectedOrdem.id!, status);
    }
    handleMenuClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Nº OS</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Veículo</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Data Abertura</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Valor Total
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Nenhuma ordem de serviço encontrada</Typography>
                </TableCell>
              </TableRow>
            ) : (
              ordens.map((ordem) => {
                const statusConfig = getStatusConfig(ordem.status);
                return (
                  <TableRow
                    key={ordem.id}
                    hover
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer',
                    }}
                  >
                    <TableCell>
                      <Chip
                        label={`#${ordem.id}`}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontFamily: 'monospace',
                          bgcolor: 'primary.50',
                          color: 'primary.main',
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {ordem.clienteNome || 'Cliente não informado'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {ordem.veiculoPlaca || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ordem.veiculoModelo || 'Modelo não informado'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{formatDate(ordem.dataAbertura)}</Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        icon={statusConfig.icon}
                        label={statusConfig.label}
                        color={statusConfig.color}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="primary.main">
                        {formatCurrency(ordem.valorTotal)}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        {ordem.status === OrdemServicoStatus.PRONTA && onReceberPagamento && (
                          <Tooltip title="Receber Pagamento">
                            <IconButton
                              size="small"
                              onClick={() => onReceberPagamento(ordem)}
                              sx={{
                                color: 'success.main',
                                '&:hover': { bgcolor: 'success.50' },
                              }}
                            >
                              <AttachMoneyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {onPrint && (
                          <Tooltip title="Imprimir">
                            <IconButton
                              size="small"
                              onClick={() => onPrint(ordem)}
                              sx={{
                                color: 'primary.main',
                                '&:hover': { bgcolor: 'primary.50' },
                              }}
                            >
                              <PrintIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Visualizar">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(ordem)}
                            sx={{
                              color: 'primary.main',
                              '&:hover': { bgcolor: 'primary.50' },
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(ordem)}
                            sx={{
                              color: 'info.main',
                              '&:hover': { bgcolor: 'info.50' },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {onStatusChange && (
                          <Tooltip title="Alterar Status">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, ordem)}
                              sx={{
                                color: 'warning.main',
                                '&:hover': { bgcolor: 'warning.50' },
                              }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            onClick={() => ordem.id && onDelete(ordem.id)}
                            sx={{
                              color: 'error.main',
                              '&:hover': { bgcolor: 'error.50' },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {ordens.length > 0 && (
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={onPageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
            }
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          />
        )}
      </TableContainer>

      {/* Menu de alteração de status */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            minWidth: 220,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <MenuItem disabled sx={{ opacity: 1, cursor: 'default' }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary">
            ALTERAR STATUS
          </Typography>
        </MenuItem>
        {Object.values(OrdemServicoStatus).map((status) => {
          const config = getStatusConfig(status);
          const isCurrentStatus = selectedOrdem?.status === status;
          return (
            <MenuItem
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={isCurrentStatus}
              sx={{
                py: 1.5,
                '&:hover': {
                  bgcolor: isCurrentStatus ? 'transparent' : 'action.hover',
                },
              }}
            >
              <ListItemIcon>{config.icon}</ListItemIcon>
              <ListItemText
                primary={config.label}
                primaryTypographyProps={{
                  fontWeight: isCurrentStatus ? 600 : 400,
                }}
              />
              {isCurrentStatus && (
                <Chip
                  label="Atual"
                  size="small"
                  color={config.color}
                  sx={{ ml: 1, height: 20 }}
                />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default OrdemServicoList;
