import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  Box, CssBaseline, AppBar, Toolbar, Typography,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  IconButton, Divider, useMediaQuery, useTheme, Collapse
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HistoryIcon from '@mui/icons-material/History';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { DRAWER_WIDTH, ROUTES } from '../../constants';
import ThemeToggle from './ThemeToggle';
import UserProfile from './UserProfile';
import { getPageTitle } from '../../hooks/usePageTitle';

const drawerWidth = DRAWER_WIDTH;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.DASHBOARD },
  { text: 'Clientes', icon: <PeopleIcon />, path: ROUTES.CLIENTS },
  { text: 'Veículos', icon: <DirectionsCarIcon />, path: ROUTES.VEHICLES },
  { text: 'Orçamentos', icon: <BuildIcon />, path: ROUTES.QUOTES },
  { text: 'Ordens de Serviço', icon: <AssignmentIcon />, path: ROUTES.SERVICE_ORDERS },
  { text: 'Histórico', icon: <HistoryIcon />, path: ROUTES.HISTORY },
  {
    text: 'Financeiro',
    icon: <AttachMoneyIcon />,
    submenu: [
      { text: 'Recibos', icon: <ReceiptIcon />, path: ROUTES.RECEIPTS },
      { text: 'Relatório de Faturamento', icon: <AssessmentIcon />, path: ROUTES.FINANCIAL_REPORT },
    ],
  },
  { text: 'Serviços', icon: <HomeRepairServiceIcon />, path: ROUTES.SERVICES },
];

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('Financeiro'); // Aberto por padrão
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate(ROUTES.LOGIN);
  };

  const handleSubmenuClick = (text: string) => {
    setOpenSubmenu(openSubmenu === text ? null : text);
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
          Oficina SaaS
        </Typography>
      </Box>
      <Divider />
      <UserProfile />
      <Divider />
      <List>
        {menuItems.map((item) => {
          if (item.submenu) {
            // Item com submenu
            const isSubmenuOpen = openSubmenu === item.text;
            const isAnySubmenuActive = item.submenu.some(sub => location.pathname === sub.path);

            return (
              <React.Fragment key={item.text}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleSubmenuClick(item.text)}
                    sx={{
                      backgroundColor: isAnySubmenuActive ? 'action.selected' : 'transparent',
                      borderRight: isAnySubmenuActive ? 3 : 0,
                      borderColor: 'primary.main',
                    }}
                  >
                    <ListItemIcon sx={{ color: isAnySubmenuActive ? 'primary.main' : 'inherit' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isAnySubmenuActive ? 600 : 400,
                        color: isAnySubmenuActive ? 'primary.main' : 'inherit',
                      }}
                    />
                    {isSubmenuOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={isSubmenuOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenu.map((subItem) => {
                      const isActive = location.pathname === subItem.path;
                      return (
                        <ListItem key={subItem.text} disablePadding>
                          <ListItemButton
                            component={RouterLink}
                            to={subItem.path}
                            onClick={isMobile ? handleDrawerToggle : undefined}
                            sx={{
                              pl: 4,
                              backgroundColor: isActive ? 'action.selected' : 'transparent',
                              borderRight: isActive ? 3 : 0,
                              borderColor: 'primary.main',
                              '&:hover': {
                                backgroundColor: isActive ? 'action.selected' : 'action.hover',
                              },
                            }}
                          >
                            <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit' }}>
                              {subItem.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={subItem.text}
                              primaryTypographyProps={{
                                fontWeight: isActive ? 600 : 400,
                                color: isActive ? 'primary.main' : 'inherit',
                                fontSize: '0.9rem',
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          } else {
            // Item normal sem submenu
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  onClick={isMobile ? handleDrawerToggle : undefined}
                  sx={{
                    backgroundColor: isActive ? 'action.selected' : 'transparent',
                    borderRight: isActive ? 3 : 0,
                    borderColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: isActive ? 'action.selected' : 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'primary.main' : 'inherit',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          }
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {pageTitle}
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          minHeight: '100vh',
          marginTop: '64px',
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
