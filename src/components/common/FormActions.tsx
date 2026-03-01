import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, CircularProgress } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Ações padronizadas para formulários
 * Botões consistentes com feedback visual
 */
const FormActions = ({
  onCancel,
  onSubmit,
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  loading = false,
  disabled = false,
  submitIcon: SubmitIcon = SaveIcon,
  showCancel = true,
  fullWidth = false,
  justifyContent = 'flex-end',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        justifyContent,
        flexDirection: { xs: 'column', sm: 'row' },
        mt: 4,
      }}
    >
      {showCancel && (
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
          startIcon={<CloseIcon />}
          fullWidth={fullWidth}
          sx={{
            borderRadius: 2,
            py: 1.2,
            px: 3,
            textTransform: 'none',
            fontWeight: 500,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          }}
        >
          {cancelLabel}
        </Button>
      )}

      <Button
        type="submit"
        variant="contained"
        onClick={onSubmit}
        disabled={loading || disabled}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SubmitIcon />}
        fullWidth={fullWidth}
        sx={{
          borderRadius: 2,
          py: 1.2,
          px: 4,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
            background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)',
          },
          '&:disabled': {
            background: 'rgba(0,0,0,0.12)',
          },
        }}
      >
        {loading ? 'Salvando...' : submitLabel}
      </Button>
    </Box>
  );
};

FormActions.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  submitIcon: PropTypes.elementType,
  showCancel: PropTypes.bool,
  fullWidth: PropTypes.bool,
  justifyContent: PropTypes.string,
};

export default FormActions;
