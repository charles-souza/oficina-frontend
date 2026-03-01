import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Divider } from '@mui/material';

/**
 * Seção de formulário para agrupar campos relacionados
 * Melhora organização e escaneabilidade
 */
const FormSection = ({ title, subtitle, children, divider = true }) => {
  return (
    <Box sx={{ mb: 4 }}>
      {(title || subtitle) && (
        <Box sx={{ mb: 2.5 }}>
          {title && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: subtitle ? 0.5 : 0,
                fontSize: '1.1rem',
              }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
              }}
            >
              {subtitle}
            </Typography>
          )}
          {divider && <Divider sx={{ mt: 1.5, mb: 2.5 }} />}
        </Box>
      )}
      {children}
    </Box>
  );
};

FormSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  divider: PropTypes.bool,
};

export default FormSection;
