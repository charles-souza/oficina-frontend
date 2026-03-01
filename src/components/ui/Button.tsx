import React from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outlined' | 'text' | 'danger';
  loading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  startIcon,
  ...props
}) => {
  const getVariant = (): MuiButtonProps['variant'] => {
    if (variant === 'outlined' || variant === 'text') return variant;
    return 'contained';
  };

  const getColor = (): MuiButtonProps['color'] => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'secondary';
      case 'danger':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <MuiButton
      variant={getVariant()}
      color={getColor()}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} /> : startIcon}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
