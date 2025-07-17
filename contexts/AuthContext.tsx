// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  fullName: string;
  username: string;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (fullName: string, username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://carsle-server.com:30080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, logout user
      await AsyncStorage.removeItem('userToken');
      router.replace('/(auth)/login');
    }
    return Promise.reject(error);
  }
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        // Validate token with your API
        const userData = await validateToken(token);
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateToken = async (token: string): Promise<User> => {
    try {
      const response = await api.get('/validate-token');
      return response.data;
    } catch (error) {
      throw new Error('Token validation failed');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      const { token, user: userData } = response.data;
      
      await AsyncStorage.setItem('userToken', token);
      console.log(token)
      setUser(userData);
      router.replace('/(tabs)');
      return { success: true };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Login failed';
        return { success: false, error: message };
      }
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (fullName: string, username: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/signup', {
        fullName,
        username,
        email,
        password,
      });
      
      const { token, user: userData } = response.data;
      
      await AsyncStorage.setItem('userToken', token);
      setUser(userData);
      router.replace('/(tabs)');
      return { success: true };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Registration failed';
        return { success: false, error: message };
      }
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      // Optional: Call logout endpoint to invalidate token on server
      await api.post('/auth/logout').catch(() => {
        // Ignore errors when calling logout endpoint
      });
      
      await AsyncStorage.removeItem('userToken');
      setUser(null);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};