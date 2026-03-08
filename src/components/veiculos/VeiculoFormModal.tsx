import React from 'react';
import { Dialog, DialogContent, IconButton, Box, Typography, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EditIcon from '@mui/icons-material/Edit';
import VeiculoForm from './VeiculoForm';

const VeiculoFormModal = ({ open, onClose, veiculo, onSave }) => {
  const isEditing = !!veiculo;

  return (
    <Dialog
      open={!!open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        }
      }}
    >
      {/* Header com gradiente */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '12px 12px 0 0',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isEditing ? <EditIcon /> : <DirectionsCarIcon />}
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {isEditing ? 'Editar Veículo' : 'Novo Veículo'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              {isEditing
                ? 'Atualize as informações do veículo'
                : 'Cadastre um novo veículo no sistema'}
            </Typography>
          </Box>
        </Box>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'white',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Paper>

      <DialogContent sx={{ p: 3, pt: 3 }}>
        <VeiculoForm veiculo={veiculo} onSave={onSave} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default VeiculoFormModal;
