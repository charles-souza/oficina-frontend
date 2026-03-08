/**
 * Exemplo de componente que lista serviços com filtros
 * Este arquivo serve como referência de como usar o servicoService atualizado
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
} from '@mui/icons-material';
import { servicoService, ServicoFilters } from '../../services/servicoService';
import { Servico } from '../../types';
import { useNotification } from '../../contexts/NotificationContext';

const ServicosListExample: React.FC = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ServicoFilters>({
    ativo: undefined,
    categoria: '',
    search: '',
  });
  const { showSuccess, showError } = useNotification();

  // Carregar categorias ao montar o componente
  useEffect(() => {
    loadCategorias();
  }, []);

  // Carregar serviços quando os filtros mudarem
  useEffect(() => {
    loadServicos();
  }, [filters]);

  const loadCategorias = async () => {
    try {
      const data = await servicoService.getCategories();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadServicos = async () => {
    setLoading(true);
    try {
      // Remove filtros vazios
      const activeFilters: ServicoFilters = {};
      if (filters.ativo !== undefined) activeFilters.ativo = filters.ativo;
      if (filters.categoria) activeFilters.categoria = filters.categoria;
      if (filters.search) activeFilters.search = filters.search;

      const data = await servicoService.getAll(activeFilters);
      setServicos(data);
    } catch (error) {
      showError('Erro ao carregar serviços');
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAtivo = async (servico: Servico) => {
    if (!servico.id) return;

    try {
      if (servico.ativo) {
        await servicoService.deactivate(servico.id);
        showSuccess('Serviço desativado com sucesso');
      } else {
        await servicoService.activate(servico.id);
        showSuccess('Serviço ativado com sucesso');
      }
      await loadServicos();
    } catch (error) {
      showError('Erro ao alterar status do serviço');
      console.error('Erro ao alterar status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja realmente excluir este serviço?')) return;

    try {
      await servicoService.delete(id);
      showSuccess('Serviço excluído com sucesso');
      await loadServicos();
    } catch (error) {
      showError('Erro ao excluir serviço');
      console.error('Erro ao excluir:', error);
    }
  };

  const handleFilterChange = (key: keyof ServicoFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      ativo: undefined,
      categoria: '',
      search: '',
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Catálogo de Serviços
      </Typography>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filtros
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Buscar por nome"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Digite o nome do serviço"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Categoria"
                value={filters.categoria || ''}
                onChange={(e) => handleFilterChange('categoria', e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {categorias.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Status"
                value={filters.ativo === undefined ? '' : filters.ativo.toString()}
                onChange={(e) =>
                  handleFilterChange(
                    'ativo',
                    e.target.value === '' ? undefined : e.target.value === 'true'
                  )
                }
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="true">Ativos</MenuItem>
                <MenuItem value="false">Inativos</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Lista de Serviços */}
      {!loading && (
        <Grid container spacing={2}>
          {servicos.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                Nenhum serviço encontrado
              </Typography>
            </Grid>
          ) : (
            servicos.map((servico) => (
              <Grid item xs={12} md={6} lg={4} key={servico.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" component="div">
                        {servico.nome}
                      </Typography>
                      <Chip
                        label={servico.ativo ? 'Ativo' : 'Inativo'}
                        color={servico.ativo ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>

                    {servico.descricao && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {servico.descricao}
                      </Typography>
                    )}

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h5" color="primary">
                        R$ {servico.precoPadrao.toFixed(2)}
                      </Typography>
                      {servico.tempoEstimado && (
                        <Typography variant="caption" color="text.secondary">
                          Tempo estimado: {servico.tempoEstimado} min
                        </Typography>
                      )}
                    </Box>

                    {servico.categoria && (
                      <Chip
                        label={servico.categoria}
                        size="small"
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    )}

                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <IconButton
                        size="small"
                        color={servico.ativo ? 'success' : 'default'}
                        onClick={() => handleToggleAtivo(servico)}
                        title={servico.ativo ? 'Desativar' : 'Ativar'}
                      >
                        {servico.ativo ? <ActiveIcon /> : <InactiveIcon />}
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => console.log('Editar:', servico.id)}
                        title="Editar"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => servico.id && handleDelete(servico.id)}
                        title="Excluir"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
};

export default ServicosListExample;
