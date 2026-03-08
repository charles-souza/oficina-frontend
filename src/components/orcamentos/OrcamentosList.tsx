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
  ListItemText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BuildIcon from '@mui/icons-material/Build';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BlockIcon from '@mui/icons-material/Block';

const OrcamentosList = ({ orcamentos = [], onEdit, onDelete, onGerarOS, onStatusChange, page=0, rowsPerPage=10, totalCount=0, onPageChange, onRowsPerPageChange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedOrcamento, setSelectedOrcamento] = React.useState(null);

  // Debug: ver o que está chegando
  React.useEffect(() => {
    if (orcamentos.length > 0) {
      console.log('Orçamentos recebidos na lista:', orcamentos);
      console.log('Primeiro orçamento:', orcamentos[0]);
    }
  }, [orcamentos]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      'PENDENTE': { label: 'Pendente', color: 'warning', icon: <HourglassEmptyIcon fontSize="small" /> },
      'APROVADO': { label: 'Aprovado', color: 'success', icon: <CheckCircleIcon fontSize="small" /> },
      'REJEITADO': { label: 'Rejeitado', color: 'error', icon: <CancelIcon fontSize="small" /> },
      'CANCELADO': { label: 'Cancelado', color: 'default', icon: <BlockIcon fontSize="small" /> },
    };
    return configs[status] || { label: status, color: 'default', icon: null };
  };

  const handleMenuOpen = (event, orcamento) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrcamento(orcamento);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrcamento(null);
  };

  const handleStatusChange = (status) => {
    if (onStatusChange && selectedOrcamento) {
      onStatusChange(selectedOrcamento.id, status);
    }
    handleMenuClose();
  };

  const statusOptions = [
    { value: 'PENDENTE', ...getStatusConfig('PENDENTE') },
    { value: 'APROVADO', ...getStatusConfig('APROVADO') },
    { value: 'REJEITADO', ...getStatusConfig('REJEITADO') },
    { value: 'CANCELADO', ...getStatusConfig('CANCELADO') },
  ];

  const isExpired = (dataValidade) => {
    if (!dataValidade) return false;
    const today = new Date();
    const validade = new Date(dataValidade);
    return validade < today;
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Veículo</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Emissão</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Validade</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Valor Total</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orcamentos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">
                  Nenhum orçamento encontrado
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            orcamentos.map((o) => {
              const statusConfig = getStatusConfig(o.status);
              const expired = isExpired(o.dataValidade);

              return (
                <TableRow
                  key={o.id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    cursor: 'pointer'
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {o.clienteNome || o.clienteId}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {o.veiculoPlaca || o.veiculoId}
                    </Typography>
                    {o.veiculoModelo && (
                      <Typography variant="caption" color="text.secondary">
                        {o.veiculoModelo}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(o.dataEmissao)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="body2"
                        color={expired ? 'error.main' : 'text.primary'}
                      >
                        {formatDate(o.dataValidade)}
                      </Typography>
                      {expired && (
                        <Chip
                          label="Vencido"
                          size="small"
                          color="error"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight={600} color="primary">
                      {formatCurrency(o.valorTotal)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={statusConfig.label}
                      color={statusConfig.color}
                      size="small"
                      icon={statusConfig.icon}
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      {o.status === 'APROVADO' && onGerarOS && (
                        <Tooltip title="Gerar Ordem de Serviço">
                          <IconButton
                            size="small"
                            onClick={() => onGerarOS(o)}
                            sx={{
                              color: 'success.main',
                              '&:hover': { bgcolor: 'success.50' }
                            }}
                          >
                            <BuildIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {onStatusChange && (
                        <Tooltip title="Alterar Status">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, o)}
                            sx={{
                              color: 'text.secondary',
                              '&:hover': { bgcolor: 'action.hover' }
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      <Tooltip title="Visualizar">
                        <IconButton
                          size="small"
                          onClick={() => onEdit && onEdit(o)}
                          sx={{
                            color: 'primary.main',
                            '&:hover': { bgcolor: 'primary.50' }
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => onEdit && onEdit(o)}
                          sx={{
                            color: 'info.main',
                            '&:hover': { bgcolor: 'info.50' }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          onClick={() => onDelete && onDelete(o.id)}
                          sx={{
                            color: 'error.main',
                            '&:hover': { bgcolor: 'error.50' }
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

      {/* Menu de alteração de status */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem disabled sx={{ opacity: 1 }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary">
            ALTERAR STATUS
          </Typography>
        </MenuItem>
        {statusOptions.map((option) => {
          const isCurrentStatus = selectedOrcamento?.status === option.value;
          return (
            <MenuItem
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              disabled={isCurrentStatus}
              sx={{
                minWidth: 200,
                '&:hover': {
                  bgcolor: isCurrentStatus ? 'transparent' : 'action.hover'
                }
              }}
            >
              <ListItemIcon sx={{ color: `${option.color}.main` }}>
                {option.icon}
              </ListItemIcon>
              <ListItemText primary={option.label} />
              {isCurrentStatus && (
                <Chip
                  label="Atual"
                  size="small"
                  color={option.color}
                  sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                />
              )}
            </MenuItem>
          );
        })}
      </Menu>

      {orcamentos.length > 0 && (
        <TablePagination
          component="div"
          count={totalCount || orcamentos.length}
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
  );
};

export default OrcamentosList;
