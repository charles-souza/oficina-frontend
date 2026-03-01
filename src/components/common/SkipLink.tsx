import React from 'react';
import { Box, Link } from '@mui/material';

interface SkipLinkProps {
  href?: string;
  text?: string;
}

/**
 * Skip Link para acessibilidade
 * Permite usuários de teclado/screen reader pularem para o conteúdo principal
 */
const SkipLink: React.FC<SkipLinkProps> = ({
  href = '#main-content',
  text = 'Pular para o conteúdo principal',
}) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: -40,
        left: 0,
        zIndex: 9999,
        '&:focus-within': {
          top: 0,
        },
      }}
    >
      <Link
        href={href}
        sx={{
          display: 'block',
          p: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          textDecoration: 'none',
          fontWeight: 'bold',
          '&:focus': {
            outline: '3px solid',
            outlineColor: 'secondary.main',
            outlineOffset: '2px',
          },
        }}
      >
        {text}
      </Link>
    </Box>
  );
};

export default SkipLink;
