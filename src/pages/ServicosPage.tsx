import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  Tooltip,
  Typography,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { usePageTitle } from '../hooks/usePageTitle';
import { servicoService, ServicoFilters } from '../services/servicoService';
import { Servico } from '../types';
import { useNotification } from '../contexts/NotificationContext';
import ServicoForm from '../components/servicos/ServicoForm';
import {
  PageContainer,
  PageHeader,
  ContentCard,
  EmptyState,
  LoadingState,
} from '../components/common';

const ServicosPage: React.FC = () => {
  usePageTitle('Serviços');

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);
  const [filters, setFilters] = useState<ServicoFilters>({
    ativo: undefined,
    categoria: '',
    search: '',
  });
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadCategorias();
  }, []);

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

  const handleOpenForm = (servico?: Servico) => {
    setSelectedServico(servico || null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedServico(null);
  };

  const handleSaveSuccess = () => {
    handleCloseForm();
    loadServicos();
    loadCategorias();
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

  const hasActiveFilters = filters.search || filters.categoria || filters.ativo !== undefined;

  return (
    <PageContainer>
      <PageHeader
        title="Catálogo de Serviços"
        subtitle="Gerencie os serviços oferecidos pela oficina"
        action={{
          label: 'Novo Serviço',
          icon: <AddIcon />,
          onClick: () => handleOpenForm(),
        }}
      />

      {/* Filtros */}
      <ContentCard>
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <FilterIcon color="action" />
            <Typography variant="h6">Filtros</Typography>
            {hasActiveFilters && (
              <Chip
                label="Limpar"
                size="small"
                onClick={clearFilters}
                onDelete={clearFilters}
              />
            )}
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Buscar por nome"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Digite o nome do serviço"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
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
          </Grid>
        </Box>

        <Box sx={{ p: 3 }}>
          {loading ? (
            <LoadingState />
          ) : servicos.length === 0 ? (
            <EmptyState
              title={
                hasActiveFilters
                  ? 'Nenhum serviço encontrado com os filtros aplicados'
                  : 'Nenhum serviço cadastrado'
              }
              description={
                hasActiveFilters
                  ? 'Tente ajustar os filtros para encontrar serviços'
                  : 'Comece cadastrando seu primeiro serviço'
              }
              action={
                !hasActiveFilters
                  ? {
                      label: 'Cadastrar Primeiro Serviço',
                      icon: <AddIcon />,
                      onClick: () => handleOpenForm(),
                    }
                  : undefined
              }
            />
          ) : (
            <Grid container spacing={3}>
              {servicos.map((servico) => (
                <Grid item xs={12} sm={6} md={4} key={servico.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
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
                          sx={{ mb: 2, minHeight: 40 }}
                        >
                          {servico.descricao}
                        </Typography>
                      )}

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
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

                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 'auto' }}>
                        <Tooltip title={servico.ativo ? 'Desativar' : 'Ativar'}>
                          <IconButton
                            size="small"
                            color={servico.ativo ? 'success' : 'default'}
                            onClick={() => handleToggleAtivo(servico)}
                          >
                            {servico.ativo ? <ActiveIcon /> : <InactiveIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenForm(servico)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => servico.id && handleDelete(servico.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </ContentCard>

      {/* Dialog do Formulário */}
      <Dialog open={showForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <ServicoForm
          servico={selectedServico || undefined}
          onSave={handleSaveSuccess}
          onCancel={handleCloseForm}
        />
      </Dialog>
    </PageContainer>
  );
};

export default ServicosPage;
