import React from 'react';
import { Dialog, DialogContent, IconButton, Box, Typography, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EditIcon from '@mui/icons-material/Edit';
import ReciboForm from './ReciboForm';
import { Recibo } from '../../types/api';

interface ReciboFormModalProps {
  open: boolean;
  onClose: () => void;
  recibo?: Recibo | null;
  onSave: () => void;
}

const ReciboFormModal: React.FC<ReciboFormModalProps> = ({
  open,
  onClose,
  recibo,
  onSave,
}) => {
  const isEditing = !!recibo;

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
        },
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
            {isEditing ? <EditIcon /> : <ReceiptIcon />}
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {isEditing ? 'Editar Recibo' : 'Novo Recibo'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              {isEditing
                ? 'Atualize as informações do recibo'
                : 'Gere um recibo de pagamento para o cliente'}
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
        <ReciboForm recibo={recibo} onSave={onSave} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default ReciboFormModal;
