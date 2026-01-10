import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const ConfirmDialog = ({ open, title = 'Confirmar', description = 'Deseja confirmar?', onCancel, onConfirm }) => {
  return (
    <Dialog open={!!open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancelar</Button>
        <Button onClick={onConfirm} color="error" variant="contained">Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
