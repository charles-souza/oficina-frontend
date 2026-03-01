import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, CircularProgress, Button, Link as MuiLink} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const DashboardCard = ({ title, fetchTotal, linkTo, color }) => {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadTotal = async () => {
    setLoading(true);
    setError(false);
    try {
      const count = await fetchTotal();
      setTotal(count);
    } catch (e) {
      console.error(`Erro ao carregar total de ${title}:`, e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MuiLink component={RouterLink} to={linkTo} underline="none" sx={{ display: 'block' }}>
      <Card sx={{ backgroundColor: color, color: 'common.white' }}>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
            {loading ? (
              <CircularProgress color="inherit" size={32} />
            ) : error ? (
              <Typography variant="h4">Erro</Typography>
            ) : (
              <Typography variant="h4">{total}</Typography>
            )}
          </Box>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button size="small" variant="outlined" color="inherit" onClick={(e) => { e.preventDefault(); loadTotal(); }}>
              Atualizar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </MuiLink>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  fetchTotal: PropTypes.func.isRequired,
  linkTo: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default DashboardCard;