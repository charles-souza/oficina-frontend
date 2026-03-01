import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Add,
  Edit,
  Check,
  LocalShipping,
  Cancel,
  Build,
  DeleteOutline,
} from '@mui/icons-material';
import { HistoricoServico, TipoEvento, OrdemServicoStatus } from '../../types/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HistoricoTimelineProps {
  historicos: HistoricoServico[];
}

// Configuração de ícones por tipo de evento
const eventoConfig: Record<TipoEvento, { icon: React.ReactNode; color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' }> = {
  [TipoEvento.CRIACAO]: { icon: <Add />, color: 'primary' },
  [TipoEvento.ALTERACAO_STATUS]: { icon: <Edit />, color: 'info' },
  [TipoEvento.ADICAO_ITEM]: { icon: <Build />, color: 'secondary' },
  [TipoEvento.REMOCAO_ITEM]: { icon: <DeleteOutline />, color: 'warning' },
  [TipoEvento.CONCLUSAO]: { icon: <Check />, color: 'success' },
  [TipoEvento.ENTREGA]: { icon: <LocalShipping />, color: 'success' },
  [TipoEvento.CANCELAMENTO]: { icon: <Cancel />, color: 'error' },
};

// Configuração de labels para status
const statusLabels: Record<OrdemServicoStatus, string> = {
  [OrdemServicoStatus.ABERTA]: 'Aberta',
  [OrdemServicoStatus.EM_ANDAMENTO]: 'Em Andamento',
  [OrdemServicoStatus.AGUARDANDO_PECA]: 'Aguardando Peça',
  [OrdemServicoStatus.PRONTA]: 'Pronta',
  [OrdemServicoStatus.ENTREGUE]: 'Entregue',
  [OrdemServicoStatus.CANCELADA]: 'Cancelada',
};

const HistoricoTimeline: React.FC<HistoricoTimelineProps> = ({ historicos }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (historicos.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Nenhum histórico encontrado
        </Typography>
      </Paper>
    );
  }

  return (
    <Timeline position="right">
      {historicos.map((historico, index) => {
        const config = eventoConfig[historico.tipoEvento] || { icon: <Edit />, color: 'info' as const };
        const isLast = index === historicos.length - 1;

        return (
          <TimelineItem key={historico.id}>
            {/* Data/Hora do evento */}
            <TimelineOppositeContent
              sx={{ m: 'auto 0', maxWidth: '150px' }}
              align="right"
              variant="body2"
              color="text.secondary"
            >
              {formatDate(historico.dataEvento)}
            </TimelineOppositeContent>

            {/* Separador com ícone */}
            <TimelineSeparator>
              <TimelineDot color={config.color} sx={{ p: 1 }}>
                {config.icon}
              </TimelineDot>
              {!isLast && <TimelineConnector />}
            </TimelineSeparator>

            {/* Conteúdo do evento */}
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  '&:hover': {
                    boxShadow: 4,
                  },
                  transition: 'box-shadow 0.2s',
                }}
              >
                {/* Cabeçalho com tipo de evento */}
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="h6" component="span" fontWeight={600}>
                    {historico.tipoEvento.replace(/_/g, ' ')}
                  </Typography>
                  <Chip
                    label={historico.tipoEvento.replace(/_/g, ' ')}
                    color={config.color}
                    size="small"
                  />
                </Box>

                {/* Descrição do evento */}
                <Typography variant="body2" color="text.secondary" mb={1}>
                  {historico.descricao}
                </Typography>

                {/* Mudança de status (se aplicável) */}
                {historico.statusAnterior && historico.statusNovo && (
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Chip
                      label={statusLabels[historico.statusAnterior] || historico.statusAnterior}
                      size="small"
                      variant="outlined"
                    />
                    <Typography variant="body2">→</Typography>
                    <Chip
                      label={statusLabels[historico.statusNovo] || historico.statusNovo}
                      size="small"
                      color="primary"
                    />
                  </Box>
                )}

                {/* Informações adicionais */}
                <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                  {/* Veículo */}
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Veículo:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {historico.veiculoPlaca} - {historico.veiculoModelo}
                    </Typography>
                  </Box>

                  {/* Usuário responsável */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 28,
                        height: 28,
                        fontSize: '0.75rem',
                      }}
                    >
                      {getInitials(historico.usuarioResponsavel)}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      {historico.usuarioResponsavel}
                    </Typography>
                  </Box>
                </Box>

                {/* Número da OS (se disponível) */}
                {historico.ordemServicoNumero && (
                  <Box mt={1}>
                    <Chip
                      label={`OS #${historico.ordemServicoNumero}`}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  </Box>
                )}
              </Paper>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

export default HistoricoTimeline;
