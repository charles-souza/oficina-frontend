import React from 'react';
import {
  Card as MuiCard,
  CardProps as MuiCardProps,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
} from '@mui/material';

export interface CardProps extends MuiCardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
  divider?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  footer,
  children,
  noPadding = false,
  divider = false,
  ...props
}) => {
  return (
    <MuiCard {...props}>
      {(title || subtitle || action) && (
        <>
          <CardHeader title={title} subheader={subtitle} action={action} />
          {divider && <Divider />}
        </>
      )}

      <CardContent sx={noPadding ? { p: 0, '&:last-child': { pb: 0 } } : {}}>
        {children}
      </CardContent>

      {footer && (
        <>
          {divider && <Divider />}
          <CardActions>{footer}</CardActions>
        </>
      )}
    </MuiCard>
  );
};

export default Card;
