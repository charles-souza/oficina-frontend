import React from 'react';
import { Paper } from '@mui/material';

interface ContentCardProps {
  children: React.ReactNode;
}

const ContentCard: React.FC<ContentCardProps> = ({ children }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      {children}
    </Paper>
  );
};

export default ContentCard;
