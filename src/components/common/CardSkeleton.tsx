import React from 'react';
import { Card, CardContent, Skeleton, Box, Stack } from '@mui/material';

interface CardSkeletonProps {
  variant?: 'default' | 'metric' | 'list';
  count?: number;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({ variant = 'default', count = 1 }) => {
  const renderMetricCard = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={1}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="50%" height={20} />
        </Stack>
      </CardContent>
    </Card>
  );

  const renderListCard = () => (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Skeleton variant="text" width="80%" height={28} />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="90%" />
          <Box display="flex" gap={1} mt={2}>
            <Skeleton variant="rectangular" width={80} height={32} />
            <Skeleton variant="rectangular" width={80} height={32} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  const renderDefaultCard = () => (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={118} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" />
      </CardContent>
    </Card>
  );

  const renderCard = () => {
    switch (variant) {
      case 'metric':
        return renderMetricCard();
      case 'list':
        return renderListCard();
      default:
        return renderDefaultCard();
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index}>{renderCard()}</Box>
      ))}
    </>
  );
};

export default CardSkeleton;
