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

  // Initialize from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRoles = localStorage.getItem('roles');

    if (token && storedRoles) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
          return;
        }

        setUser({
          email: decoded.sub,
          oficinaId: decoded.oficinaId,
        });

        // Parse roles from comma-separated string
        setRoles(storedRoles.split(',').map(r => r.trim()).filter(r => r.length > 0));
      } catch (error) {
        console.error('Failed to decode token:', error);
        logout();
      }
    }
  }, []);

  const login = (token: string, rolesString: string) => {
    try {
      const decoded = jwtDecode<JWTPayload>(token);

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
    } catch (error) {
      console.error('Failed to decode token during login:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setRoles([]);
    localStorage.removeItem('token');
    localStorage.removeItem('oficinaId');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('roles');
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
