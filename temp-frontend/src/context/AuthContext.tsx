import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, User, LoginCredentials, RegisterData } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app load
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.getCurrentUser();
        if (response.status === 'success' && response.data) {
          setUser(response.data);
        } else {
          // Token is invalid, clear it
          api.logout();
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid token
      api.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const credentials: LoginCredentials = { email, password };
      const response = await api.login(credentials);
      
      if (response.status === 'success' && response.data) {
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    try {
      setIsLoading(true);
      const registerData: RegisterData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      };
      
      const response = await api.register(registerData);
      
      if (response.status === 'success' && response.data) {
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      // For now, we'll just update the local state
      // In a real app, you'd make an API call to update the user
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Update failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 