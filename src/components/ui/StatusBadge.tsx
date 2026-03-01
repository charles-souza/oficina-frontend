import React from 'react';
import { Chip } from '@mui/material';
import {
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Info,
  Error as ErrorIcon,
} from '@mui/icons-material';

export type Status = 'success' | 'error' | 'warning' | 'info' | 'pending';

export interface StatusBadgeProps {
  status: Status;
  label: string;
  showIcon?: boolean;
}

const statusConfig = {
  success: {
    color: 'success' as const,
    icon: <CheckCircle fontSize="small" />,
  },
  error: {
    color: 'error' as const,
    icon: <Cancel fontSize="small" />,
  },
  warning: {
    color: 'warning' as const,
    icon: <ErrorIcon fontSize="small" />,
  },
  info: {
    color: 'info' as const,
    icon: <Info fontSize="small" />,
  },
  pending: {
    color: 'default' as const,
    icon: <HourglassEmpty fontSize="small" />,
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  showIcon = true,
}) => {
  const config = statusConfig[status];

  return (
    <Chip
      label={label}
      color={config.color}
      icon={showIcon ? config.icon : undefined}
      size="small"
    />
  );
};

export default StatusBadge;
