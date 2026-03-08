import React from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const VeiculoList = ({ veiculos = [], onDelete, onEdit, page = 0, rowsPerPage = 10, totalCount = 0, onPageChange, onRowsPerPageChange }) => {
  const navigate = useNavigate();
  const visible = veiculos || [];

  const handleEdit = (v) => {
    if (onEdit) return onEdit(v);
    if (v && v.id) navigate(`/veiculos/editar/${v.id}`);
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
            <TableCell sx={{ fontWeight: 600 }}>Placa</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Marca/Modelo</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Ano</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Cor</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visible.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">
                  Nenhum veículo encontrado
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            visible.map((v) => (
              <TableRow
                key={v.id}
                hover
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  cursor: 'pointer'
                }}
              >
                <TableCell>
                  <Chip
                    label={v.placa || 'Sem placa'}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600, fontFamily: 'monospace' }}
                  />
                </TableCell>

                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {v.marca || 'N/A'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {v.modelo || 'Modelo não informado'}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {v.ano || 'N/A'}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {v.cor && (
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: 'grey.400',
                          border: '2px solid',
                          borderColor: 'grey.300'
                        }}
                      />
                    )}
                    <Typography variant="body2">
                      {v.cor || '-'}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {v.clienteNome || v.clienteId || 'Cliente não informado'}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                    <Tooltip title="Visualizar">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(v)}
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
                        onClick={() => handleEdit(v)}
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
                        onClick={() => onDelete && onDelete(v.id)}
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
            ))
          )}
        </TableBody>
      </Table>

      {visible.length > 0 && (
        <TablePagination
          component="div"
          count={totalCount || veiculos.length}
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

export default VeiculoList;
