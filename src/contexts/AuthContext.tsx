import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  email: string;
  oficinaId: string;
}

interface JWTPayload {
  sub: string;
  oficinaId: string;
  roles: string;
  exp: number;
  iat: number;
}

interface AuthContextType {
  user: User | null;
  roles: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, roles: string) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (...roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    console.log('[AuthContext] Inicializando...');
    const token = localStorage.getItem('token');
    const storedRoles = localStorage.getItem('roles');

    console.log('[AuthContext] Token no localStorage:', token ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
    console.log('[AuthContext] Roles no localStorage:', storedRoles);

    if (token && storedRoles) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        console.log('[AuthContext] Token decodificado com sucesso:', decoded.sub);

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          console.log('[AuthContext] Token EXPIRADO, fazendo logout');
          logout();
          setIsLoading(false);
          return;
        }

        setUser({
          email: decoded.sub,
          oficinaId: decoded.oficinaId,
        });

        // Parse roles from comma-separated string
        setRoles(storedRoles.split(',').map(r => r.trim()).filter(r => r.length > 0));
        console.log('[AuthContext] Usuário autenticado:', decoded.sub);
      } catch (error) {
        console.error('[AuthContext] Falha ao decodificar token:', error);
        logout();
      }
    } else {
      console.log('[AuthContext] Sem token ou roles - usuário NÃO autenticado');
    }

    setIsLoading(false);
    console.log('[AuthContext] Inicialização completa');
  }, []);

  const login = (token: string, rolesString: string) => {
    try {
      console.log('[AuthContext] Login iniciado');
      const decoded = jwtDecode<JWTPayload>(token);
      console.log('[AuthContext] Token decodificado:', decoded.sub);

      setUser({
        email: decoded.sub,
        oficinaId: decoded.oficinaId,
      });

      // Parse roles from comma-separated string
      const parsedRoles = rolesString.split(',').map(r => r.trim()).filter(r => r.length > 0);
      setRoles(parsedRoles);

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('oficinaId', decoded.oficinaId);
      localStorage.setItem('roles', rolesString);
      console.log('[AuthContext] Token salvo no localStorage');
      console.log('[AuthContext] Verificação:', localStorage.getItem('token') ? 'Token encontrado' : 'Token NÃO encontrado');
    } catch (error) {
      console.error('Failed to decode token during login:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('[AuthContext] LOGOUT chamado');
    console.trace('[AuthContext] Stack trace do logout');
    setUser(null);
    setRoles([]);
    localStorage.removeItem('token');
    localStorage.removeItem('oficinaId');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('roles');
    console.log('[AuthContext] localStorage limpo');
  };

  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };

  const hasAnyRole = (...requiredRoles: string[]): boolean => {
    return requiredRoles.some(role => roles.includes(role));
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        isAuthenticated,
        isLoading,
        login,
        logout,
        hasRole,
        hasAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
