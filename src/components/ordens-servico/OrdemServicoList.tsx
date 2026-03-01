import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  TablePagination,
  Box,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { OrdemServico, OrdemServicoStatus } from '../../types/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrdemServicoListProps {
  ordens: OrdemServico[];
  loading?: boolean;
  onEdit: (ordem: OrdemServico) => void;
  onDelete: (id: number) => void;
  onView?: (ordem: OrdemServico) => void;
  page: number;
  rowsPerPage: number;
  totalElements: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

// Configuração de cores por status
const statusConfig: Record<OrdemServicoStatus, { color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning', label: string }> = {
  [OrdemServicoStatus.ABERTA]: { color: 'info', label: 'Aberta' },
  [OrdemServicoStatus.EM_ANDAMENTO]: { color: 'primary', label: 'Em Andamento' },
  [OrdemServicoStatus.AGUARDANDO_PECA]: { color: 'warning', label: 'Aguardando Peça' },
  [OrdemServicoStatus.PRONTA]: { color: 'success', label: 'Pronta' },
  [OrdemServicoStatus.ENTREGUE]: { color: 'default', label: 'Entregue' },
  [OrdemServicoStatus.CANCELADA]: { color: 'error', label: 'Cancelada' },
};

const OrdemServicoList: React.FC<OrdemServicoListProps> = ({
  ordens,
  loading = false,
  onEdit,
  onDelete,
  onView,
  page,
  rowsPerPage,
  totalElements,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (ordens.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Nenhuma ordem de serviço encontrada
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 600 }}>Nº OS</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Veículo</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Data Abertura</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Valor Total</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordens.map((ordem) => (
              <TableRow
                key={ordem.id}
                sx={{
                  '&:hover': { backgroundColor: 'action.hover' },
                  transition: 'background-color 0.2s',
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    #{ordem.id}
                  </Typography>
                </TableCell>
                <TableCell>{ordem.clienteNome}</TableCell>
                <TableCell>
                  <Typography variant="body2">{ordem.veiculoPlaca}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {ordem.veiculoModelo}
                  </Typography>
                </TableCell>
                <TableCell>{formatDate(ordem.dataAbertura)}</TableCell>
                <TableCell>
                  <Chip
                    label={statusConfig[ordem.status].label}
                    color={statusConfig[ordem.status].color}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(ordem.valorTotal)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {onView && (
                    <IconButton
                      size="small"
                      onClick={() => onView(ordem)}
                      title="Visualizar"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => onEdit(ordem)}
                    color="primary"
                    title="Editar"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => ordem.id && onDelete(ordem.id)}
                    color="error"
                    title="Deletar"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Linhas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </>
  );
};

export default OrdemServicoList;
