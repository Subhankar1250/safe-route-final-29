
import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Define types for our auth context
interface Auth0ContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  loginWithRedirect: () => Promise<void>;
  logout: (options?: any) => void;
}

// Create a context for Auth0 authentication
const Auth0Context = createContext<Auth0ContextType | null>(null);

// Provider component for Auth0 authentication
export const Auth0ContextProvider = ({ children }: { children: React.ReactNode }) => {
  // Mock implementation since we're removing Auth0
  const mockAuth0 = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    loginWithRedirect: async () => {},
    logout: () => {}
  };
  
  return (
    <Auth0Context.Provider value={mockAuth0}>
      {children}
    </Auth0Context.Provider>
  );
};

// Hook to use Auth0 authentication
export const useAuth = () => {
  const context = useContext(Auth0Context);
  if (!context) {
    throw new Error('useAuth must be used within an Auth0ContextProvider');
  }
  return context;
};

// Custom hook for login functionality
export const useLoginHandler = () => {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithRedirect();
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    navigate('/login');
  };

  const handleAdminLogin = (username: string, password: string) => {
    // For demo purposes only - in a real app, this would validate against a secure backend
    if (username === 'admin@sishu-tirtha.app' && password === 'admin123') {
      // Simple admin credentials for testing
      navigate('/admin/dashboard');
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  return {
    handleLogin,
    handleLogout,
    handleAdminLogin,
    isAuthenticated,
    isLoading,
    user
  };
};
