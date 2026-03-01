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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const VeiculoList = ({ veiculos = [], onDelete, onEdit, page = 0, rowsPerPage = 10, totalCount = 0, onPageChange, onRowsPerPageChange }) => {
  const navigate = useNavigate();
  const visible = veiculos || [];

  const handleEdit = (v) => {
    if (onEdit) return onEdit(v);
    if (v && v.id) navigate(`/veiculos/editar/${v.id}`);
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h5">Lista de Veículos</Typography>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Placa</TableCell>
            <TableCell>Marca</TableCell>
            <TableCell>Modelo</TableCell>
            <TableCell>Ano</TableCell>
            <TableCell>Cliente ID</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visible.map((v) => (
            <TableRow key={v.id} hover>
              <TableCell>{v.placa}</TableCell>
              <TableCell>{v.marca}</TableCell>
              <TableCell>{v.modelo}</TableCell>
              <TableCell>{v.ano}</TableCell>
              <TableCell>{v.clienteId}</TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleEdit(v)}
                  aria-label={`Editar veículo ${v.placa}`}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete && onDelete(v.id)}
                  aria-label={`Excluir veículo ${v.placa}`}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={totalCount || veiculos.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5,10,25,50]}
      />
    </TableContainer>
  );
};

export default VeiculoList;
