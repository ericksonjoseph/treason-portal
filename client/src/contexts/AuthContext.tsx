import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { queryClient, setLogoutHandler } from '@/lib/queryClient';

interface User {
  username: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isValidUser(data: unknown): data is User {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.username === 'string' &&
    typeof obj.token === 'string' &&
    obj.username.length > 0 &&
    obj.token.length > 0
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('treason_user');
    queryClient.clear();
  };

  useEffect(() => {
    setLogoutHandler(logout);

    const storedUser = localStorage.getItem('treason_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (isValidUser(parsed)) {
          setUser(parsed);
        } else {
          localStorage.removeItem('treason_user');
        }
      } catch (e) {
        localStorage.removeItem('treason_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    // Mock login - accepts any username/password
    // TODO: Replace with real API call when backend is ready
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, password }),
    // });
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    const userData: User = {
      username,
      token: crypto.randomUUID(), // Generate mock UUID token
    };

    setUser(userData);
    localStorage.setItem('treason_user', JSON.stringify(userData));
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
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
