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

const ClienteList = ({ clientes = [], onDelete, onEdit, page = 0, rowsPerPage = 10, totalCount = 0, onPageChange, onRowsPerPageChange }) => {
  const navigate = useNavigate();
  const visibleClientes = clientes || [];

  const handleEditNavigate = (cliente) => {
    if (onEdit) return onEdit(cliente);
    if (cliente && cliente.id) {
      navigate(`/clientes/editar/${cliente.id}`);
    }
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h5">Lista de Clientes</Typography>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>CPF/CNPJ</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell>Cidade</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleClientes.map((cliente) => (
            <TableRow key={cliente.id} hover>
              <TableCell>{cliente.nome}</TableCell>
              <TableCell>{cliente.cpfCnpj}</TableCell>
              <TableCell>{cliente.email}</TableCell>
              <TableCell>{cliente.telefone}</TableCell>
              <TableCell>{cliente.cidade}</TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleEditNavigate(cliente)}
                  aria-label={`Editar cliente ${cliente.nome}`}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete && onDelete(cliente.id)}
                  aria-label={`Excluir cliente ${cliente.nome}`}
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
        count={totalCount || clientes.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5,10,25,50]}
      />
    </TableContainer>
  );
};

export default ClienteList;
