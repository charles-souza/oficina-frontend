import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import HomePage from './pages/HomePage';
import ClientesPage from './pages/ClientesPage';
import VeiculosPage from './pages/VeiculosPage';
import OrcamentosPage from './pages/OrcamentosPage';
import RecibosPage from './pages/RecibosPage';
import ServicosPage from './pages/ServicosPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClienteForm from './components/clientes/ClienteForm';
import VeiculoForm from './components/veiculos/VeiculoForm';
import OrcamentoForm from './components/orcamentos/OrcamentoForm';
import ReciboForm from './components/recibos/ReciboForm';

const AppRoutes = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Layout /> : <Navigate to="/login" />
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="home" element={<HomePage />} />
        
        <Route path="clientes">
          <Route index element={<ClientesPage />} />
          <Route path="novo" element={<ClienteForm />} />
          <Route path="editar/:id" element={<ClienteForm />} />
        </Route>
        
        <Route path="veiculos">
          <Route index element={<VeiculosPage />} />
          <Route path="novo" element={<VeiculoForm />} />
          <Route path="editar/:id" element={<VeiculoForm />} />
        </Route>
        
        <Route path="orcamentos">
          <Route index element={<OrcamentosPage />} />
          <Route path="novo" element={<OrcamentoForm />} />
          <Route path="editar/:id" element={<OrcamentoForm />} />
        </Route>
        
        <Route path="recibos">
          <Route index element={<RecibosPage />} />
          <Route path="novo" element={<ReciboForm />} />
          <Route path="editar/:id" element={<ReciboForm />} />
        </Route>

        <Route path="servicos">
          <Route index element={<ServicosPage />} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
