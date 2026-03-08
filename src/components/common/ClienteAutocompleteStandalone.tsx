import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress, Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { clienteService } from '../../services/clienteService';
import { Cliente } from '../../types';

interface ClienteAutocompleteStandaloneProps {
  value: string;
  onChange: (value: string | null) => void;
  label?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

const ClienteAutocompleteStandalone: React.FC<ClienteAutocompleteStandaloneProps> = ({
  value,
  onChange,
  label = 'Cliente',
  helperText = 'Digite para buscar clientes',
  required = false,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Carregar cliente selecionado quando o valor muda
  useEffect(() => {
    const loadSelectedCliente = async () => {
      if (value && !selectedCliente) {
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
        if (!isValidUUID) return;

        try {
          const cliente = await clienteService.getById(value);
          setSelectedCliente(cliente);
          setInputValue(cliente.nome);
        } catch (error: any) {
          if (error.status !== 404) {
            console.error('Erro ao carregar cliente:', error);
          }
        }
      } else if (!value && selectedCliente) {
        setSelectedCliente(null);
        setInputValue('');
      }
    };
    loadSelectedCliente();
  }, [value]);

  // Buscar clientes quando o usuário digita
  useEffect(() => {
    if (!open) return;

    const fetchClientes = async () => {
      setLoading(true);
      try {
        const response = await clienteService.getAll(0, 50, {
          nome: inputValue || undefined,
        });
        setOptions(response.content || []);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [open, inputValue]);

  const handleChange = (_event: any, newValue: Cliente | null) => {
    setSelectedCliente(newValue);
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
      value={selectedCliente}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      loading={loading}
      disabled={disabled}
      getOptionLabel={(option) => option.nome || ''}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
      noOptionsText="Nenhum cliente encontrado"
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
                <PersonIcon sx={{ color: 'action.active', mr: 1, ml: 1 }} />
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
              {option.nome}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {option.cpfCnpj && `CPF/CNPJ: ${option.cpfCnpj}`}
              {option.telefone && ` • Tel: ${option.telefone}`}
            </Typography>
          </Box>
        </Box>
      )}
    />
  );
};

export default ClienteAutocompleteStandalone;
