import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Box, InputAdornment, CircularProgress } from '@mui/material';
import { useField } from 'formik';

/**
 * Campo de formulário padronizado com validação Formik
 * Design moderno, minimalista e acessível
 */
const FormField = ({
  name,
  label,
  type = 'text',
  placeholder,
  helperText,
  startIcon,
  endIcon,
  loading = false,
  disabled = false,
  required = false,
  multiline = false,
  rows = 4,
  select = false,
  children,
  autoComplete,
  inputProps,
  onChange,
  ...props
}) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && Boolean(meta.error);

  const handleChange = (e) => {
    field.onChange(e);
    if (onChange) onChange(e);
  };

  return (
    <Box sx={{ mb: 2.5 }}>
      <TextField
        {...field}
        {...props}
        onChange={handleChange}
        id={name}
        name={name}
        label={label}
        type={type}
        placeholder={placeholder}
        error={hasError}
        helperText={hasError ? meta.error : helperText}
        disabled={disabled || loading}
        required={required}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        select={select}
        autoComplete={autoComplete}
        fullWidth
        variant="outlined"
        InputProps={{
          startAdornment: startIcon ? (
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ) : null,
          endAdornment: loading ? (
            <InputAdornment position="end">
              <CircularProgress size={20} />
            </InputAdornment>
          ) : endIcon ? (
            <InputAdornment position="end">{endIcon}</InputAdornment>
          ) : null,
          ...inputProps,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: hasError ? 'error.main' : 'primary.light',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
              },
            },
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
          },
          '& .MuiFormHelperText-root': {
            marginLeft: 0,
            marginTop: 0.5,
            fontSize: '0.75rem',
          },
        }}
      >
        {children}
      </TextField>
    </Box>
  );
};

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  select: PropTypes.bool,
  children: PropTypes.node,
  autoComplete: PropTypes.string,
  inputProps: PropTypes.object,
  onChange: PropTypes.func,
};

export default FormField;
