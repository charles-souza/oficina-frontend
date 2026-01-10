import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid, Button, TextField } from '@mui/material';
import ClienteList from '../components/clientes/ClienteList';
import ClienteFormModal from '../components/clientes/ClienteFormModal';
import { clienteService } from '../services/clienteService';
import ConfirmDialog from '../components/common/ConfirmDialog';

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({ nome: '', cpfCnpj: '', email: '' });
  const [hasSearched, setHasSearched] = useState(false);

  const fetchClientes = useCallback(async (p = 0, size = rowsPerPage, filtersObj = {}) => {
    setLoading(true);
    try {
      setError(null);
      const data = await clienteService.getAll(p, size, filtersObj);
      if (data && data.content) {
        setClientes(data.content);
        setTotal(data.totalElements || data.total || 0);
      } else if (Array.isArray(data)) {
        setClientes(data);
        setTotal(data.length);
      } else {
        setClientes([]);
        setTotal(0);
      }
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      setError('Erro ao carregar clientes.');
      setClientes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [rowsPerPage]);

  useEffect(() => {}, []);

  const openNewModal = () => { setSelectedCliente(null); setModalOpen(true); };
  const openEditModal = (cliente) => { setSelectedCliente(cliente); setModalOpen(true); };
  const closeModal = () => { setSelectedCliente(null); setModalOpen(false); };

  const handleSave = async (cliente) => {
    try {
      if (cliente && cliente.id) await clienteService.update(cliente.id, cliente);
      else await clienteService.create(cliente);
      await fetchClientes(0, rowsPerPage, filters);
      setHasSearched(true);
      setModalOpen(false);
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      setError('Erro ao salvar cliente.');
    }
  };

  const handleDeleteConfirm = (id) => {
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!toDeleteId) return;
    try {
      await clienteService.delete(toDeleteId);
      setConfirmOpen(false);
      setToDeleteId(null);
      await fetchClientes(page, rowsPerPage, filters);
      setHasSearched(true);
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      setError('Erro ao excluir cliente.');
    }
  };

  const handleChangePage = async (_event, newPage) => { setPage(newPage); await fetchClientes(newPage, rowsPerPage, filters); setHasSearched(true); };
  const handleChangeRowsPerPage = async (event) => { const newSize = parseInt(event.target.value, 10); setRowsPerPage(newSize); setPage(0); await fetchClientes(0, newSize, filters); setHasSearched(true); };

  const handleSearch = async (e) => { if (e) e.preventDefault(); setHasSearched(true); await fetchClientes(0, rowsPerPage, filters); };
  const handleClear = () => { setFilters({ nome: '', cpfCnpj: '', email: '' }); setHasSearched(false); setClientes([]); setTotal(0); setError(null); };

  return (
    <Box sx={{ width: '100%', px: 0 }}>
      <Typography variant="h4" component="h1" gutterBottom>Clientes</Typography>

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField label="Nome" value={filters.nome} onChange={(e) => setFilters(f => ({ ...f, nome: e.target.value }))} fullWidth />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField label="CPF/CNPJ" value={filters.cpfCnpj} onChange={(e) => setFilters(f => ({ ...f, cpfCnpj: e.target.value }))} fullWidth />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField label="Email" value={filters.email} onChange={(e) => setFilters(f => ({ ...f, email: e.target.value }))} fullWidth />
          </Grid>

          <Grid item xs={12} md={3} sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button type="submit" variant="contained" color="primary">Pesquisar</Button>
            <Button type="button" variant="outlined" onClick={handleClear}>Limpar</Button>
            <Button type="button" variant="contained" color="secondary" onClick={openNewModal}>Novo Cliente</Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container>
        <Grid item xs={12}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>Carregando clientes...</Box>
          ) : error ? (
            <Box sx={{ p: 3 }}>
              <Typography color="error">{error}</Typography>
              <Button onClick={() => fetchClientes(0, rowsPerPage, filters)}>Tentar novamente</Button>
            </Box>
          ) : clientes.length === 0 && !hasSearched ? (
            <Box sx={{ p: 3 }}><Typography>Nenhuma busca realizada. Use os filtros acima e clique em Pesquisar.</Typography></Box>
          ) : clientes.length === 0 ? (
            <Box sx={{ p: 3 }}><Typography>Nenhum cliente encontrado.</Typography></Box>
          ) : (
            <ClienteList clientes={clientes} onDelete={handleDeleteConfirm} onEdit={openEditModal} page={page} rowsPerPage={rowsPerPage} totalCount={total} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
          )}
        </Grid>
      </Grid>

      <ClienteFormModal open={modalOpen} onClose={closeModal} cliente={selectedCliente} onSave={handleSave} />

      <ConfirmDialog open={confirmOpen} title="Confirmar exclusão" description="Deseja realmente excluir este cliente?" onCancel={() => setConfirmOpen(false)} onConfirm={handleDelete} />
    </Box>
  );
};

export default ClientesPage;
