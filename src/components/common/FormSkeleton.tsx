import React from 'react';
import { Paper, Box, Skeleton, Stack, Divider } from '@mui/material';

interface FormSkeletonProps {
  fields?: number;
}

const FormSkeleton: React.FC<FormSkeletonProps> = ({ fields = 6 }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />

      <Stack spacing={3}>
        {Array.from({ length: Math.ceil(fields / 2) }).map((_, sectionIndex) => (
          <Box key={sectionIndex}>
            {sectionIndex > 0 && <Divider sx={{ mb: 3 }} />}

            <Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />

            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
              {Array.from({ length: 2 }).map((_, fieldIndex) => (
                <Box key={fieldIndex}>
                  <Skeleton variant="text" width="40%" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton variant="rectangular" height={40} />
                </Box>
              ))}
            </Box>
          </Box>
        ))}

        <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
          <Skeleton variant="rectangular" width={100} height={36} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </Box>
      </Stack>
    </Paper>
  );
};

export default FormSkeleton;
