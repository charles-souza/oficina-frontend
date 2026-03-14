import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from './contexts/AuthContext';

// Componentes carregados imediatamente (críticos)
import Layout from './components/common/Layout';
import LoginPage from './pages/LoginPage';
import RoleGuard from './components/common/RoleGuard';

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
const RelatorioFaturamentoPage = lazy(() => import('./pages/RelatorioFaturamentoPage'));
const UsuariosPage = lazy(() => import('./pages/UsuariosPage'));

// Lazy loading de formulários
const ClienteForm = lazy(() => import('./components/clientes/ClienteForm'));
const VeiculoForm = lazy(() => import('./components/veiculos/VeiculoForm'));
const OrcamentoForm = lazy(() => import('./components/orcamentos/OrcamentoForm'));
const ReciboForm = lazy(() => import('./components/recibos/ReciboForm'));
const UsuarioForm = lazy(() => import('./components/usuarios/UsuarioForm'));

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
  const { isAuthenticated } = useAuth();

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
            <RoleGuard allowedRoles={['ROLE_ADMIN']}>
              <Suspense fallback={<LoadingFallback />}>
                <DashboardPage />
              </Suspense>
            </RoleGuard>
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
              <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                <Suspense fallback={<LoadingFallback />}>
                  <ClientesPage />
                </Suspense>
              </RoleGuard>
            }
          />
          <Route
            path="novo"
            element={
              <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                <Suspense fallback={<LoadingFallback />}>
                  <ClienteForm />
                </Suspense>
              </RoleGuard>
            }
          />
          <Route
            path="editar/:id"
            element={
              <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                <Suspense fallback={<LoadingFallback />}>
                  <ClienteForm />
                </Suspense>
              </RoleGuard>
            }
          />
        </Route>

        <Route path="veiculos">
          <Route
            index
            element={
              <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                <Suspense fallback={<LoadingFallback />}>
                  <VeiculosPage />
                </Suspense>
              </RoleGuard>
            }
          />
          <Route
            path="novo"
            element={
              <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                <Suspense fallback={<LoadingFallback />}>
                  <VeiculoForm />
                </Suspense>
              </RoleGuard>
            }
          />
          <Route
            path="editar/:id"
            element={
              <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                <Suspense fallback={<LoadingFallback />}>
                  <VeiculoForm />
                </Suspense>
              </RoleGuard>
            }
          />
        </Route>

        <Route path="orcamentos">
          <Route
            index
            element={
              <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_MECANICO']}>
                <Suspense fallback={<LoadingFallback />}>
                  <OrcamentosPage />
                </Suspense>
              </RoleGuard>
            }
          />
          <Route
            path="novo"
            element={
              <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_MECANICO']}>
                <Suspense fallback={<LoadingFallback />}>
                  <OrcamentoForm />
                </Suspense>
              </RoleGuard>
            }
          />
          <Route
            path="editar/:id"
            element={
              <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_MECANICO']}>
                <Suspense fallback={<LoadingFallback />}>
                  <OrcamentoForm />
                </Suspense>
              </RoleGuard>
            }
          />
        </Route>

        <Route path="financeiro">
          <Route path="recibos">
            <Route
              index
              element={
                <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                  <Suspense fallback={<LoadingFallback />}>
                    <RecibosPage />
                  </Suspense>
                </RoleGuard>
              }
            />
            <Route
              path="novo"
              element={
                <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                  <Suspense fallback={<LoadingFallback />}>
                    <ReciboForm />
                  </Suspense>
                </RoleGuard>
              }
            />
            <Route
              path="editar/:id"
              element={
                <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                  <Suspense fallback={<LoadingFallback />}>
                    <ReciboForm />
                  </Suspense>
                </RoleGuard>
              }
            />
          </Route>
          <Route
            path="relatorio-faturamento"
            element={
              <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                <Suspense fallback={<LoadingFallback />}>
                  <RelatorioFaturamentoPage />
                </Suspense>
              </RoleGuard>
            }
          />
        </Route>

        <Route
          path="servicos"
          element={
            <RoleGuard allowedRoles={['ROLE_ADMIN']}>
              <Suspense fallback={<LoadingFallback />}>
                <ServicosPage />
              </Suspense>
            </RoleGuard>
          }
        />

        <Route
          path="ordens-servico"
          element={
            <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_MECANICO']}>
              <Suspense fallback={<LoadingFallback />}>
                <OrdensServicoPage />
              </Suspense>
            </RoleGuard>
          }
        />

        <Route
          path="historico"
          element={
            <RoleGuard allowedRoles={['ROLE_ADMIN']}>
              <Suspense fallback={<LoadingFallback />}>
                <HistoricoPage />
              </Suspense>
            </RoleGuard>
          }
        />

        <Route
          path="perfil"
          element={
            <RoleGuard allowedRoles={['ROLE_ADMIN']}>
              <Suspense fallback={<LoadingFallback />}>
                <PerfilPage />
              </Suspense>
            </RoleGuard>
          }
        />

        <Route
          path="configuracoes"
          element={
            <RoleGuard allowedRoles={['ROLE_ADMIN']}>
              <Suspense fallback={<LoadingFallback />}>
                <ConfiguracoesPage />
              </Suspense>
            </RoleGuard>
          }
        />

        <Route path="usuarios">
          <Route
            index
            element={
              <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                <Suspense fallback={<LoadingFallback />}>
                  <UsuariosPage />
                </Suspense>
              </RoleGuard>
            }
          />
          <Route
            path="novo"
            element={
              <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                <Suspense fallback={<LoadingFallback />}>
                  <UsuarioForm />
                </Suspense>
              </RoleGuard>
            }
          />
          <Route
            path="editar/:id"
            element={
              <RoleGuard allowedRoles={['ROLE_ADMIN']}>
                <Suspense fallback={<LoadingFallback />}>
                  <UsuarioForm />
                </Suspense>
              </RoleGuard>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
