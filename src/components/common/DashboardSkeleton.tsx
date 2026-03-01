import React from 'react';
import { Box, Paper, Skeleton } from '@mui/material';

const DashboardSkeleton: React.FC = () => {
  return (
    <Box>
      {/* Header Skeleton */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
        }}
      >
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={24} />
      </Paper>

      {/* Metric Cards Skeleton */}
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap={3} mb={3}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Box key={index}>
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={48} sx={{ my: 1 }} />
              <Skeleton variant="text" width="50%" height={20} />
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Status Cards Skeleton */}
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap={3} mb={3}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Box key={index}>
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={48} sx={{ my: 1 }} />
              <Skeleton variant="text" width="50%" height={20} />
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Charts Skeleton */}
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3} mb={3}>
        <Box>
          <Paper sx={{ p: 3 }}>
            <Skeleton variant="text" width="40%" height={28} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={300} />
          </Paper>
        </Box>
        <Box>
          <Paper sx={{ p: 3 }}>
            <Skeleton variant="text" width="40%" height={28} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={300} />
          </Paper>
        </Box>
      </Box>

      {/* Revenue Cards Skeleton */}
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={3}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Box key={index}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Skeleton variant="text" width="60%" height={24} sx={{ mx: 'auto', mb: 1 }} />
              <Skeleton variant="text" width="80%" height={48} sx={{ mx: 'auto' }} />
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DashboardSkeleton;
