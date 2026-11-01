import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { api, getAuthToken, setAuthToken, clearAuthToken } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  loginAsDemo: (role: 'ADMIN' | 'CUSTOMER' | 'DRIVER' | 'DRIVER_PENDING') => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      if (getAuthToken()) {
        const res = await api.getMe();
        setUser(res.user);
      }
    } catch {
      clearAuthToken();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login({ email, password: pass });
    setAuthToken(res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const loginAsDemo = async (role: 'ADMIN' | 'CUSTOMER' | 'DRIVER' | 'DRIVER_PENDING') => {
    let email = 'alex.patel@example.com';
    let pass = 'Customer@123!';

    if (role === 'ADMIN') {
      email = 'admin@driverondemand.com';
      pass = 'Admin@2026!';
    } else if (role === 'DRIVER') {
      email = 'vikram.singh@example.com';
      pass = 'Driver@123!';
    } else if (role === 'DRIVER_PENDING') {
      email = 'suresh.verma@example.com';
      pass = 'Driver@123!';
    }

    return await login(email, pass);
  };

  const logout = () => {
    clearAuthToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsDemo,
        logout,
        refreshUser: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

