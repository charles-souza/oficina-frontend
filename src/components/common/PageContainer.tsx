import React from 'react';
import { Box, Paper, Fade } from '@mui/material';

interface PageContainerProps {
  children: React.ReactNode;
  loading?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, loading }) => {
  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Fade in={!loading} timeout={400}>
        <Box>{children}</Box>
      </Fade>
    </Box>
  );
};

export default PageContainer;
