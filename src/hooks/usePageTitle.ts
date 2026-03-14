import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../constants';

// Mapeamento de rotas para títulos
const routeTitles: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.CLIENTS]: 'Clientes',
  [ROUTES.VEHICLES]: 'Veículos',
  [ROUTES.QUOTES]: 'Orçamentos',
  [ROUTES.RECEIPTS]: 'Recibos',
  [ROUTES.FINANCIAL_REPORT]: 'Relatório de Faturamento',
  [ROUTES.SERVICES]: 'Serviços',
  [ROUTES.SERVICE_ORDERS]: 'Ordens de Serviço',
  [ROUTES.HISTORY]: 'Histórico',
  [ROUTES.PROFILE]: 'Perfil',
  [ROUTES.SETTINGS]: 'Configurações',
  [ROUTES.USERS]: 'Usuários',
};

/**
 * Hook para gerenciar o título da página baseado na rota atual
 * Atualiza o document.title automaticamente
 */
export const usePageTitle = (customTitle?: string): string => {
  const location = useLocation();

  useEffect(() => {
    const baseTitle = 'Oficina SaaS';
    const pageTitle = customTitle || routeTitles[location.pathname] || 'Página';
    document.title = `${pageTitle} | ${baseTitle}`;

    return () => {
      document.title = baseTitle;
    };
  }, [location.pathname, customTitle]);

  return customTitle || routeTitles[location.pathname] || 'Página';
};

/**
 * Retorna o título da página atual sem side effects
 */
export const getPageTitle = (pathname: string): string => {
  return routeTitles[pathname] || 'Página';
};
