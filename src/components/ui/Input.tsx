import React from 'react';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  mask?: (value: string) => string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  variant = 'outlined',
  mask,
  onChange,
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mask) {
      e.target.value = mask(e.target.value);
    }
    onChange?.(e);
  };

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <TextField
      {...props}
      type={inputType}
      variant={variant}
      onChange={handleChange}
      InputProps={{
        ...props.InputProps,
        endAdornment: isPassword ? (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
              size="small"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : (
          props.InputProps?.endAdornment
        ),
      }}
    />
  );
};

export default Input;
