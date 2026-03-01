import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import OrdemServicoForm from './OrdemServicoForm';
import { OrdemServicoRequest } from '../../types/api';

interface OrdemServicoFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: OrdemServicoRequest) => void;
  initialValues?: OrdemServicoRequest;
  loading?: boolean;
}

const OrdemServicoFormModal: React.FC<OrdemServicoFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          {initialValues ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <OrdemServicoForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          onCancel={onClose}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default OrdemServicoFormModal;
