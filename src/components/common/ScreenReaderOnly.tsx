import React from 'react';
import { Box, BoxProps } from '@mui/material';

/**
 * Componente visualmente oculto mas acessível para screen readers
 */
const ScreenReaderOnly: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      component="span"
      sx={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ScreenReaderOnly;
