import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Typography, Divider, Fade } from '@mui/material';

/**
 * Container padronizado para formulários
 * Layout moderno, responsivo e minimalista
 */
const FormContainer = ({
  title,
  subtitle,
  children,
  maxWidth = 800,
  elevation = 1,
  showDivider = true,
}) => {
  return (
    <Fade in timeout={400}>
      <Paper
        elevation={elevation}
        sx={{
          maxWidth,
          mx: 'auto',
          my: 3,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        {/* Header */}
        {(title || subtitle) && (
          <Box
            sx={{
              p: 3,
              pb: showDivider ? 2 : 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            {title && (
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 600,
                  mb: subtitle ? 0.5 : 0,
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  fontWeight: 400,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        )}

        {showDivider && (title || subtitle) && <Divider />}

        {/* Content */}
        <Box sx={{ p: 3 }}>{children}</Box>
      </Paper>
    </Fade>
  );
};

FormContainer.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.number,
  elevation: PropTypes.number,
  showDivider: PropTypes.bool,
};

export default FormContainer;
