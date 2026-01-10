import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ClienteForm from './ClienteForm';

const ClienteFormModal = ({ open, onClose, cliente, onSave }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {cliente ? 'Editar Cliente' : 'Novo Cliente'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <ClienteForm cliente={cliente} onSave={onSave} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default ClienteFormModal;
