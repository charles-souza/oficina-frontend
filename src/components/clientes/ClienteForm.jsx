import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, CircularProgress, Alert, Grid } from '@mui/material';
import { clienteService } from '../../services/clienteService';
import cepService from '../../services/cepService';
import SnackbarMessage from '../common/SnackbarMessage';

const onlyDigits = (v = '') => String(v).replace(/\D/g, '');
const formatCpfCnpj = (v = '') => {
  const d = onlyDigits(v);
  if (!d) return '';
  if (d.length <= 11) {
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (m, a, b, c, rest) => `${a}${b ? '.' + b : ''}${c ? '.' + c : ''}${rest ? '-' + rest : ''}`);
  }
  return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, (m, a, b, c, d1, e) => `${a}${b ? '.' + b : ''}${c ? '.' + c : ''}${d1 ? '/' + d1 : ''}${e ? '-' + e : ''}`);
};
const formatTelefone = (v = '') => {
  const d = onlyDigits(v);
  if (!d) return '';
  if (d.length === 11) return d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  if (d.length === 10) return d.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  return v;
};
const formatCep = (v = '') => {
  const d = onlyDigits(v);
  if (!d) return '';
  if (d.length <= 5) return d;
  return d.replace(/(\d{5})(\d{0,3})/, '$1-$2');
};

const ClienteForm = ({ cliente: propCliente, onSave, onCancel }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nome: '', email: '', cpfCnpj: '', telefone: '', cep: '', cidade: '',
    estado: '', bairro: '', rua: '', numero: '', complemento: '', observacoes: ''
  });
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [initializing, setInitializing] = useState(!!id);
  const [error, setError] = useState(null);
  const [validation, setValidation] = useState({});
  const [snack, setSnack] = useState({ open: false, severity: 'success', message: '' });
  const isEditing = !!(id || (propCliente && propCliente.id));
  const mountedRef = useRef(true);
  const cepDebounceRef = useRef(null);
  const lastCepRef = useRef('');
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    if (cepDebounceRef.current) clearTimeout(cepDebounceRef.current);
  };
  }, []);

  useEffect(() => {
    if (propCliente) {
      setFormData(prev => ({ ...prev, ...mapClienteToForm(propCliente) }));
      setInitializing(false);
    }
  }, [propCliente]);

  useEffect(() => {
    const fetch = async () => {
          const clienteId = id || (propCliente && propCliente.id);
      if (!clienteId) { setInitializing(false); return; }
      try {
        const cliente = await clienteService.getById(clienteId);
        if (!mountedRef.current) return;
        setFormData(prev => ({ ...prev, ...mapClienteToForm(cliente) }));
    } catch (err) {
        if (!mountedRef.current) return;
        setError('Erro ao carregar dados do cliente.');
      console.error(err);
    } finally {
        if (mountedRef.current) setInitializing(false);
    }
  };
    fetch();
  }, [id, propCliente]);

  function mapClienteToForm(cliente) {
    return {
      nome: cliente.nome || '',
      email: cliente.email || '',
      cpfCnpj: cliente.cpfCnpj || '',
      telefone: cliente.telefone || '',
      cep: cliente.cep ? formatCep(cliente.cep) : '',
      cidade: cliente.cidade || '',
      estado: cliente.estado || '',
      bairro: cliente.bairro || '',
      rua: cliente.endereco || cliente.rua || '',
      numero: cliente.numero || '',
      complemento: cliente.complemento || '',
      observacoes: cliente.observacoes || ''
};
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidation(prev => ({ ...prev, [name]: '' }));
  };

  const handleFormattedChange = (name, formatter) => (e) => {
    const raw = e.target.value;
    setFormData(prev => ({ ...prev, [name]: formatter(raw) }));
    setValidation(prev => ({ ...prev, [name]: '' }));
  };

  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'cep') triggerCepLookup(value);
  };

  useEffect(() => {
    const cleaned = onlyDigits(formData.cep || '');
    if (cleaned.length !== 8) return;
    if (lastCepRef.current === cleaned) return;
    if (cepDebounceRef.current) clearTimeout(cepDebounceRef.current);
    cepDebounceRef.current = setTimeout(() => triggerCepLookup(cleaned), 500);
    return () => { if (cepDebounceRef.current) clearTimeout(cepDebounceRef.current); };
  }, [formData.cep]);

  const triggerCepLookup = async (cepValue) => {
    const cleaned = onlyDigits(cepValue || '');
    if (cleaned.length !== 8) return;
    if (lastCepRef.current === cleaned) return;
    setCepLoading(true); setError(null);
    try {
      const address = await cepService.getAddressByCep(cleaned);
      if (!mountedRef.current) return;
      lastCepRef.current = cleaned;
      setFormData(prev => ({
        ...prev,
        rua: address.rua || prev.rua,
        complemento: address.complemento || prev.complemento,
        bairro: address.bairro || prev.bairro,
        cidade: address.cidade || prev.cidade,
        estado: address.estado || prev.estado,
      }));
    } catch (err) {
      console.error('CEP lookup failed:', err);
      if (mountedRef.current) setError(err.message || 'Erro ao consultar CEP');
    } finally {
      if (mountedRef.current) setCepLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextValidation = {};
    if (!formData.nome || formData.nome.trim().length < 2) nextValidation.nome = 'Informe o nome (mínimo 2 caracteres)';
    if (formData.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) nextValidation.email = 'Email inválido';
    if (Object.keys(nextValidation).length) { setValidation(nextValidation); return; }

    const payload = {
      nome: formData.nome || '',
      cpfCnpj: onlyDigits(formData.cpfCnpj || ''),
      telefone: formData.telefone || '',
      email: formData.email || '',
      endereco: formData.rua ? `${formData.rua}${formData.numero ? ', ' + formData.numero : ''}${formData.complemento ? ' - ' + formData.complemento : ''}` : '',
      bairro: formData.bairro || '',
      cidade: formData.cidade || '',
      estado: formData.estado || '',
      cep: onlyDigits(formData.cep || ''),
      observacoes: formData.observacoes || ''
    };

    try {
      setLoading(true); setError(null);
      if (onSave && typeof onSave === 'function') {
        await onSave(payload);
        setSnack({ open: true, severity: 'success', message: 'Cliente salvo com sucesso' });
      } else {
        if (isEditing) {
          const clienteId = id || (propCliente && propCliente.id);
          await clienteService.update(clienteId, payload);
          setSnack({ open: true, severity: 'success', message: 'Cliente atualizado com sucesso' });
        } else {
          await clienteService.create(payload);
          setSnack({ open: true, severity: 'success', message: 'Cliente criado com sucesso' });
        }
        navigate('/clientes');
      }
    } catch (err) {
      if (mountedRef.current) setError(`Erro ao ${isEditing ? 'atualizar' : 'criar'} cliente.`);
      console.error(err);
      setSnack({ open: true, severity: 'error', message: 'Erro ao salvar cliente' });
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  if (initializing) return (<Box sx={{ display: 'flex', justifyContent: 'center', p: 3, width: '100%' }}><CircularProgress /></Box>);

  return (
    <Paper elevation={2} sx={{ p: 3, width: '100%', maxWidth: '100%', boxSizing: 'border-box', mx: 0 }}>
      {isEditing && (<Typography variant="h5" component="h1" gutterBottom>Editar Cliente</Typography>)}
      {error && (<Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>)}

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '100%', margin: 0 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>Dados Pessoais</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                required id="nome" name="nome" label="Nome"
                value={formData.nome} onChange={handleChange}
                error={!!validation.nome} helperText={validation.nome}
                inputProps={{ maxLength: 100 }} fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField id="email" name="email" label="Email"
                value={formData.email} onChange={handleChange}
                error={!!validation.email} helperText={validation.email}
                inputProps={{ maxLength: 100 }} fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField id="cpfCnpj" name="cpfCnpj" label="CPF/CNPJ"
                value={formData.cpfCnpj} onChange={handleFormattedChange('cpfCnpj', formatCpfCnpj)}
                inputProps={{ maxLength: 18 }} fullWidth />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField id="telefone" name="telefone" label="Telefone"
                value={formData.telefone} onChange={handleFormattedChange('telefone', formatTelefone)}
                inputProps={{ maxLength: 15 }} fullWidth />
            </Grid>

            <Grid item xs={12} md={4} />
          </Grid>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>Endereço</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField id="cep" name="cep" label="CEP"
                value={formData.cep} onChange={handleFormattedChange('cep', formatCep)}
                onBlur={handleFieldBlur}
                helperText={cepLoading ? 'Consultando CEP...' : ''}
                inputProps={{ maxLength: 9 }} fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField id="cidade" name="cidade" label="Cidade" value={formData.cidade} onChange={handleChange} inputProps={{ maxLength: 60 }} fullWidth />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField id="estado" name="estado" label="Estado" value={formData.estado} onChange={handleChange} inputProps={{ maxLength: 2 }} fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField id="bairro" name="bairro" label="Bairro" value={formData.bairro} onChange={handleChange} inputProps={{ maxLength: 80 }} fullWidth />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField id="rua" name="rua" label="Rua" value={formData.rua} onChange={handleChange} inputProps={{ maxLength: 120 }} fullWidth />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField id="numero" name="numero" label="Número" value={formData.numero} onChange={handleChange} inputProps={{ maxLength: 12 }} fullWidth />
            </Grid>

            <Grid item xs={12} md={9}>
              <TextField id="complemento" name="complemento" label="Complemento" value={formData.complemento} onChange={handleChange} inputProps={{ maxLength: 80 }} fullWidth />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>Observações</Typography>
          <TextField id="observacoes" name="observacoes" label="Observações" multiline rows={4} value={formData.observacoes} onChange={handleChange} inputProps={{ maxLength: 1000 }} fullWidth />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={() => { if (onCancel) onCancel(); else navigate('/clientes'); }} disabled={loading}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>{loading ? <CircularProgress size={24} /> : isEditing ? 'Atualizar' : 'Salvar'}</Button>
        </Box>
      </form>

      <SnackbarMessage open={snack.open} severity={snack.severity} message={snack.message} onClose={() => setSnack({ open: false })} />
    </Paper>
  );
};

export default ClienteForm;
