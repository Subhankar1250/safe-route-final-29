
import { createContext, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

// Create a context for Auth0 authentication
const Auth0Context = createContext<ReturnType<typeof useAuth0> | null>(null);

// Provider component for Auth0 authentication
export const Auth0ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const auth0 = useAuth0();
  
  return (
    <Auth0Context.Provider value={auth0}>
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
  };

  return {
    handleLogin,
    handleLogout,
    isAuthenticated,
    isLoading,
    user
  };
};
