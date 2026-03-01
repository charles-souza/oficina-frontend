import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const OrcamentosList = ({ orcamentos = [], onEdit, onDelete, page=0, rowsPerPage=10, totalCount=0, onPageChange, onRowsPerPageChange }) => {
  return (
    <TableContainer component={Paper} sx={{ mt:2 }}>
      <Box sx={{ p:2, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <Typography variant="h5">Orçamentos</Typography>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Veículo</TableCell>
            <TableCell>Data Emissão</TableCell>
            <TableCell>Validade</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orcamentos.map(o => (
            <TableRow key={o.id} hover>
              <TableCell>{o.id}</TableCell>
              <TableCell>{o.clienteId}</TableCell>
              <TableCell>{o.veiculoId}</TableCell>
              <TableCell>{o.dataEmissao}</TableCell>
              <TableCell>{o.dataValidade}</TableCell>
              <TableCell>{o.status}</TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onEdit && onEdit(o)}
                  aria-label={`Editar orçamento ${o.id}`}
                >
                  <EditIcon fontSize="small"/>
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete && onDelete(o.id)}
                  aria-label={`Excluir orçamento ${o.id}`}
                >
                  <DeleteIcon fontSize="small"/>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination component="div" count={totalCount||orcamentos.length} page={page} onPageChange={onPageChange} rowsPerPage={rowsPerPage} onRowsPerPageChange={onRowsPerPageChange} rowsPerPageOptions={[5,10,25,50]} />
    </TableContainer>
  );
};

export default OrcamentosList;
