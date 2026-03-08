import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress, Box, Typography } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { veiculoService } from '../../services/veiculoService';
import { Veiculo } from '../../types';

interface VeiculoAutocompleteStandaloneProps {
  value: string;
  onChange: (value: string | null) => void;
  label?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  clienteId?: string;
}

const VeiculoAutocompleteStandalone: React.FC<VeiculoAutocompleteStandaloneProps> = ({
  value,
  onChange,
  label = 'Veículo',
  helperText = 'Digite placa ou modelo para buscar',
  required = false,
  disabled = false,
  clienteId,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVeiculo, setSelectedVeiculo] = useState<Veiculo | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Carregar veículo selecionado quando o valor muda
  useEffect(() => {
    const loadSelectedVeiculo = async () => {
      if (value && !selectedVeiculo) {
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
        if (!isValidUUID) return;

        try {
          const veiculo = await veiculoService.getById(value);
          setSelectedVeiculo(veiculo);
          setInputValue(`${veiculo.placa} - ${veiculo.marca} ${veiculo.modelo}`);
        } catch (error: any) {
          if (error.status !== 404) {
            console.error('Erro ao carregar veículo:', error);
          }
        }
      } else if (!value && selectedVeiculo) {
        setSelectedVeiculo(null);
        setInputValue('');
      }
    };
    loadSelectedVeiculo();
  }, [value]);

  // Buscar veículos quando o usuário digita
  useEffect(() => {
    if (!open) return;

    const fetchVeiculos = async () => {
      setLoading(true);
      try {
        const filters: any = {
          placa: inputValue || undefined,
        };

        if (clienteId) {
          filters.clienteId = clienteId;
        }

        const response = await veiculoService.getAll(0, 50, filters);
        setOptions(response.content || []);
      } catch (error) {
        console.error('Erro ao buscar veículos:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVeiculos();
  }, [open, inputValue, clienteId]);

  const handleChange = (_event: any, newValue: Veiculo | null) => {
    setSelectedVeiculo(newValue);
    onChange(newValue ? newValue.id : null);
  };

  const handleInputChange = (_event: any, newInputValue: string) => {
    setInputValue(newInputValue);
  };

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={selectedVeiculo}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      loading={loading}
      disabled={disabled}
      getOptionLabel={(option) => `${option.placa} - ${option.marca} ${option.modelo}` || ''}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
      noOptionsText={clienteId ? 'Nenhum veículo encontrado para este cliente' : 'Nenhum veículo encontrado'}
      loadingText="Carregando..."
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <DirectionsCarIcon sx={{ color: 'action.active', mr: 1, ml: 1 }} />
                {params.InputProps.startAdornment}
              </>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.id}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="body1" fontWeight={500}>
              {option.placa} - {option.marca} {option.modelo}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {option.ano && `Ano: ${option.ano}`}
              {option.cor && ` • Cor: ${option.cor}`}
            </Typography>
          </Box>
        </Box>
      )}
    />
  );
};

export default VeiculoAutocompleteStandalone;
