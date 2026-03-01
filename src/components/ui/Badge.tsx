import React from 'react';
import { Chip, ChipProps } from '@mui/material';

export interface BadgeProps extends Omit<ChipProps, 'variant' | 'color'> {
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
  text?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  text = false,
  ...props
}) => {
  const getColor = (): ChipProps['color'] => {
    switch (variant) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      color={getColor()}
      variant={text ? 'outlined' : 'filled'}
      size="small"
      {...props}
    />
  );
};

export default Badge;
