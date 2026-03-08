import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress, Box, Typography } from '@mui/material';
import { useField, useFormikContext } from 'formik';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { veiculoService } from '../../services/veiculoService';
import { Veiculo } from '../../types';

interface VeiculoAutocompleteProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  clienteId?: string;
}

const VeiculoAutocomplete: React.FC<VeiculoAutocompleteProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  clienteId,
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVeiculo, setSelectedVeiculo] = useState<Veiculo | null>(null);
  const [inputValue, setInputValue] = useState('');

  const hasError = meta.touched && Boolean(meta.error);
  const errorMessage = meta.touched && meta.error ? meta.error : '';

  // Carregar veículo selecionado quando o componente monta (modo edição)
  useEffect(() => {
    const loadSelectedVeiculo = async () => {
      if (field.value && !selectedVeiculo) {
        // Validar se é um UUID válido antes de buscar
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(field.value);

        if (!isValidUUID) {
          console.warn(`VeiculoAutocomplete: ID inválido fornecido: ${field.value}`);
          return;
        }

        try {
          const veiculo = await veiculoService.getById(field.value);
          setSelectedVeiculo(veiculo);
          setInputValue(`${veiculo.placa} - ${veiculo.marca} ${veiculo.modelo}`);
        } catch (error: any) {
          // Silenciar erro 404 (veículo não encontrado) - é esperado em dev
          if (error.status !== 404) {
            console.error('Erro ao carregar veículo selecionado:', error);
          }
        }
      }
    };
    loadSelectedVeiculo();
  }, [field.value, selectedVeiculo]);

  // Buscar veículos quando o usuário digita
  useEffect(() => {
    if (!open) {
      return;
    }

    const fetchVeiculos = async () => {
      setLoading(true);
      try {
        const filters: any = {
          placa: inputValue || undefined,
        };

        // Se clienteId foi fornecido, filtrar por cliente
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
    setFieldValue(name, newValue ? newValue.id : '');
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
      isOptionEqualToValue={(option, value) => option.id === value.id}
      noOptionsText={clienteId ? "Nenhum veículo encontrado para este cliente" : "Nenhum veículo encontrado"}
      loadingText="Carregando..."
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={hasError}
          helperText={errorMessage || (clienteId ? 'Veículos do cliente selecionado' : 'Digite placa ou modelo para buscar')}
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
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: hasError ? 'error.main' : 'rgba(0, 0, 0, 0.23)',
          },
        },
      }}
    />
  );
};

export default VeiculoAutocomplete;
