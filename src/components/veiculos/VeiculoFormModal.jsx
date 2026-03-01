import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VeiculoForm from './VeiculoForm';

const VeiculoFormModal = ({ open, onClose, veiculo, onSave }) => {
  return (
    <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {veiculo ? 'Editar Veículo' : 'Novo Veículo'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <VeiculoForm veiculo={veiculo} onSave={onSave} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default VeiculoFormModal;
