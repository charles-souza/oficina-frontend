import React from 'react';
import { Box, Paper, Skeleton, Stack } from '@mui/material';
import TableSkeleton from './TableSkeleton';

interface PageSkeletonProps {
  variant?: 'table' | 'grid';
  rows?: number;
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({ variant = 'table', rows = 5 }) => {
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

      {/* Actions Bar Skeleton */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <Skeleton variant="rectangular" width={200} height={40} />
          <Box sx={{ flex: 1 }} />
          <Stack direction="row" spacing={2}>
            <Skeleton variant="rectangular" width={100} height={40} />
            <Skeleton variant="rectangular" width={120} height={40} />
          </Stack>
        </Stack>
      </Paper>

      {/* Content Skeleton */}
      {variant === 'table' ? (
        <TableSkeleton rows={rows} columns={5} />
      ) : (
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }} gap={3}>
          {Array.from({ length: rows }).map((_, index) => (
            <Paper key={index} sx={{ p: 3 }}>
              <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="90%" />
              <Box display="flex" gap={1} mt={2}>
                <Skeleton variant="rectangular" width={70} height={32} />
                <Skeleton variant="rectangular" width={70} height={32} />
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PageSkeleton;
