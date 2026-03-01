import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

// Componentes carregados imediatamente (críticos)
import Layout from './components/common/Layout';
import LoginPage from './pages/LoginPage';

// Lazy loading de páginas
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const ClientesPage = lazy(() => import('./pages/ClientesPage'));
const VeiculosPage = lazy(() => import('./pages/VeiculosPage'));
const OrcamentosPage = lazy(() => import('./pages/OrcamentosPage'));
const RecibosPage = lazy(() => import('./pages/RecibosPage'));
const ServicosPage = lazy(() => import('./pages/ServicosPage'));
const OrdensServicoPage = lazy(() => import('./pages/OrdensServicoPage'));
const HistoricoPage = lazy(() => import('./pages/HistoricoPage'));
const PerfilPage = lazy(() => import('./pages/PerfilPage'));
const ConfiguracoesPage = lazy(() => import('./pages/ConfiguracoesPage'));

// Lazy loading de formulários
const ClienteForm = lazy(() => import('./components/clientes/ClienteForm'));
const VeiculoForm = lazy(() => import('./components/veiculos/VeiculoForm'));
const OrcamentoForm = lazy(() => import('./components/orcamentos/OrcamentoForm'));
const ReciboForm = lazy(() => import('./components/recibos/ReciboForm'));

// Loading fallback
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="400px"
  >
    <CircularProgress />
  </Box>
);

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
        <Route
          index
          element={
            <Suspense fallback={<LoadingFallback />}>
              <DashboardPage />
            </Suspense>
          }
        />
        <Route
          path="home"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <HomePage />
            </Suspense>
          }
        />

        <Route path="clientes">
          <Route
            index
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ClientesPage />
              </Suspense>
            }
          />
          <Route
            path="novo"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ClienteForm />
              </Suspense>
            }
          />
          <Route
            path="editar/:id"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ClienteForm />
              </Suspense>
            }
          />
        </Route>

        <Route path="veiculos">
          <Route
            index
            element={
              <Suspense fallback={<LoadingFallback />}>
                <VeiculosPage />
              </Suspense>
            }
          />
          <Route
            path="novo"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <VeiculoForm />
              </Suspense>
            }
          />
          <Route
            path="editar/:id"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <VeiculoForm />
              </Suspense>
            }
          />
        </Route>

        <Route path="orcamentos">
          <Route
            index
            element={
              <Suspense fallback={<LoadingFallback />}>
                <OrcamentosPage />
              </Suspense>
            }
          />
          <Route
            path="novo"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <OrcamentoForm />
              </Suspense>
            }
          />
          <Route
            path="editar/:id"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <OrcamentoForm />
              </Suspense>
            }
          />
        </Route>

        <Route path="recibos">
          <Route
            index
            element={
              <Suspense fallback={<LoadingFallback />}>
                <RecibosPage />
              </Suspense>
            }
          />
          <Route
            path="novo"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ReciboForm />
              </Suspense>
            }
          />
          <Route
            path="editar/:id"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ReciboForm />
              </Suspense>
            }
          />
        </Route>

        <Route
          path="servicos"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ServicosPage />
            </Suspense>
          }
        />

        <Route
          path="ordens-servico"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <OrdensServicoPage />
            </Suspense>
          }
        />

        <Route
          path="historico"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <HistoricoPage />
            </Suspense>
          }
        />

        <Route
          path="perfil"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PerfilPage />
            </Suspense>
          }
        />

        <Route
          path="configuracoes"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ConfiguracoesPage />
            </Suspense>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
