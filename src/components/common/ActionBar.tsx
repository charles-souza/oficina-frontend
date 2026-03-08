import React from 'react';
import { Box, Button, ButtonProps } from '@mui/material';

export interface Action {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'contained' | 'outlined' | 'text';
  color?: ButtonProps['color'];
  disabled?: boolean;
}

interface ActionBarProps {
  actions: Action[];
  children?: React.ReactNode;
}

const ActionBar: React.FC<ActionBarProps> = ({ actions, children }) => {
  return (
    <Box
      sx={{
        p: 3,
        borderBottom: '1px solid',
        borderColor: 'divider',
        background: 'rgba(0,0,0,0.02)',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || (index === 0 ? 'contained' : 'outlined')}
            onClick={action.onClick}
            startIcon={action.icon}
            color={action.color}
            disabled={action.disabled}
            sx={{
              borderRadius: 2,
              py: 1.2,
              px: 3,
              textTransform: 'none',
              fontWeight: index === 0 ? 600 : 500,
              ...(action.variant === 'contained' && index === 0
                ? {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
                      background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)',
                    },
                  }
                : action.variant === 'outlined'
                ? {
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    },
                  }
                : {}),
            }}
          >
            {action.label}
          </Button>
        ))}
        {children}
      </Box>
    </Box>
  );
};

export default ActionBar;
