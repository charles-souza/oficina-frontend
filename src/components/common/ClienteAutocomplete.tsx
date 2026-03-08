import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress, Box, Typography } from '@mui/material';
import { useField, useFormikContext } from 'formik';
import PersonIcon from '@mui/icons-material/Person';
import { clienteService } from '../../services/clienteService';
import { Cliente } from '../../types';

interface ClienteAutocompleteProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
}

const ClienteAutocomplete: React.FC<ClienteAutocompleteProps> = ({
  name,
  label,
  required = false,
  disabled = false,
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [inputValue, setInputValue] = useState('');

  const hasError = meta.touched && Boolean(meta.error);
  const errorMessage = meta.touched && meta.error ? meta.error : '';

  // Carregar cliente selecionado quando o componente monta (modo edição)
  useEffect(() => {
    const loadSelectedCliente = async () => {
      if (field.value && !selectedCliente) {
        // Validar se é um UUID válido antes de buscar
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(field.value);

        if (!isValidUUID) {
          console.warn(`ClienteAutocomplete: ID inválido fornecido: ${field.value}`);
          return;
        }

        try {
          const cliente = await clienteService.getById(field.value);
          setSelectedCliente(cliente);
          setInputValue(cliente.nome);
        } catch (error: any) {
          // Silenciar erro 404 (cliente não encontrado) - é esperado em dev
          if (error.status !== 404) {
            console.error('Erro ao carregar cliente selecionado:', error);
          }
        }
      }
    };
    loadSelectedCliente();
  }, [field.value, selectedCliente]);

  // Buscar clientes quando o usuário digita
  useEffect(() => {
    if (!open) {
      return;
    }

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
      value={selectedCliente}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      loading={loading}
      disabled={disabled}
      getOptionLabel={(option) => option.nome || ''}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      noOptionsText="Nenhum cliente encontrado"
      loadingText="Carregando..."
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={hasError}
          helperText={errorMessage || 'Digite para buscar clientes'}
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

export default ClienteAutocomplete;
