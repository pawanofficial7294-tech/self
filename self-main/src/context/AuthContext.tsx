import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'NGO' | 'OFFICER' | 'ADMIN';

export interface UserPermissions {
  canUploadImages: boolean;
  canPostJobs: boolean;
  canSubmitProjects: boolean;
  canManageSchemes: boolean;
  canManageUsers: boolean;
}

export interface UserSession {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  darpanId?: string; // For NGO
  officerId?: string; // For Officer/Admin
  token: string;
  permissions?: UserPermissions;
}

interface AuthContextProps {
  user: UserSession | null;
  login: (id: string, pass: string, role: UserRole) => Promise<UserSession>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem('gov-portal-session');
    if (savedSession) {
      try {
        setUser(JSON.parse(savedSession));
      } catch (error) {
        console.error('Failed to parse auth session', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (id: string, pass: string, role: UserRole): Promise<UserSession> => {
    setIsLoading(true);
    try {
      const { authService } = await import('../services/authService');
      const session = await authService.login(id, pass, role);
      setUser(session);
      localStorage.setItem('gov-portal-session', JSON.stringify(session));
      return session;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gov-portal-session');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
