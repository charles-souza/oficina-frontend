import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';
import { ROUTES } from '../../constants';

// Mapeamento de rotas para títulos legíveis
const routeTitles: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.CLIENTS]: 'Clientes',
  [ROUTES.VEHICLES]: 'Veículos',
  [ROUTES.QUOTES]: 'Orçamentos',
  [ROUTES.RECEIPTS]: 'Recibos',
  [ROUTES.SERVICES]: 'Serviços',
  [ROUTES.SERVICE_ORDERS]: 'Ordens de Serviço',
  [ROUTES.HISTORY]: 'Histórico',
  [ROUTES.PROFILE]: 'Perfil',
  [ROUTES.SETTINGS]: 'Configurações',
};

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Se estiver na home/dashboard, não mostrar breadcrumbs
  if (pathnames.length === 0 || location.pathname === ROUTES.DASHBOARD) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <MuiBreadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            mx: 0.5,
          },
        }}
      >
        {/* Link para Dashboard (Home) */}
        <Link
          component={RouterLink}
          to={ROUTES.DASHBOARD}
          underline="hover"
          color="inherit"
          sx={{
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          <Home sx={{ mr: 0.5, fontSize: '1.2rem' }} />
          Dashboard
        </Link>

        {/* Breadcrumbs intermediários e finais */}
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const title = routeTitles[to] || value.charAt(0).toUpperCase() + value.slice(1);

          return isLast ? (
            <Typography
              key={to}
              color="text.primary"
              sx={{ fontWeight: 600 }}
            >
              {title}
            </Typography>
          ) : (
            <Link
              key={to}
              component={RouterLink}
              to={to}
              underline="hover"
              color="inherit"
              sx={{
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {title}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
