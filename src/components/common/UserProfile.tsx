import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Person,
  Settings,
  Logout,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface UserProfileProps {
  userName?: string;
  userEmail?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userName, userEmail }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { user, roles, logout: authLogout, hasRole } = useAuth();

  // Get user information from AuthContext or props
  const displayName = userName || user?.email?.split('@')[0] || 'Usuário';
  const displayEmail = userEmail || user?.email || 'usuario@oficina.com';

  // Determine role label
  const getRoleLabel = () => {
    if (hasRole('ROLE_ADMIN')) return 'Administrador';
    if (hasRole('ROLE_MECANICO')) return 'Mecânico';
    return 'Usuário';
  };

  const roleLabel = getRoleLabel();

  // Gerar iniciais para o avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate('/perfil');
  };

  const handleSettings = () => {
    handleClose();
    navigate('/configuracoes');
  };

  const handleLogout = () => {
    handleClose();
    authLogout();
    navigate('/login');
  };

  return (
    <>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
          transition: 'background-color 0.2s',
        }}
        onClick={handleClick}
      >
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 40,
            height: 40,
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          {getInitials(displayName)}
        </Avatar>
        <Box sx={{ ml: 1.5, flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {displayName}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            {displayEmail}
          </Typography>
          <Chip
            label={roleLabel}
            size="small"
            color={hasRole('ROLE_ADMIN') ? 'primary' : 'default'}
            sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
          />
        </Box>
        <IconButton size="small" sx={{ ml: 0.5 }}>
          <KeyboardArrowDown fontSize="small" />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 200,
            mt: 0.5,
            '& .MuiMenuItem-root': {
              py: 1.5,
            },
          },
        }}
      >
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Meu Perfil
        </MenuItem>
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Configurações
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Sair
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserProfile;
