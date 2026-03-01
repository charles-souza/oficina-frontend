import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OrcamentoForm from './OrcamentoForm';

const OrcamentoFormModal = ({ open, onClose, orcamento, onSave }) => {
  return (
    <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ m:0, p:2 }}>
        {orcamento ? 'Editar Orçamento' : 'Novo Orçamento'}
        <IconButton aria-label="close" onClick={onClose} sx={{ position:'absolute', right:8, top:8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <OrcamentoForm orcamento={orcamento} onSave={onSave} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default OrcamentoFormModal;
