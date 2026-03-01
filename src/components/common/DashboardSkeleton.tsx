import React from 'react';
import { Box, Paper, Skeleton } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

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
      <Grid container spacing={3} mb={3}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid key={index} xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={48} sx={{ my: 1 }} />
              <Skeleton variant="text" width="50%" height={20} />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Status Cards Skeleton */}
      <Grid container spacing={3} mb={3}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid key={index} xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={48} sx={{ my: 1 }} />
              <Skeleton variant="text" width="50%" height={20} />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts Skeleton */}
      <Grid container spacing={3} mb={3}>
        <Grid xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Skeleton variant="text" width="40%" height={28} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={300} />
          </Paper>
        </Grid>
        <Grid xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Skeleton variant="text" width="40%" height={28} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={300} />
          </Paper>
        </Grid>
      </Grid>

      {/* Revenue Cards Skeleton */}
      <Grid container spacing={3}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Grid key={index} xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Skeleton variant="text" width="60%" height={24} sx={{ mx: 'auto', mb: 1 }} />
              <Skeleton variant="text" width="80%" height={48} sx={{ mx: 'auto' }} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardSkeleton;
