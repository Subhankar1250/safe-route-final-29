
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useToast } from '@/components/ui/use-toast';
import { 
  loginWithEmail, 
  loginWithUsername, 
  registerUser, 
  signOut, 
  onAuthStateChange 
} from '@/services/firebase';

// Define types for our auth context
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'driver' | 'guardian';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  register: (email: string, password: string, role: string, name: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

// Initialize with empty values
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Check for existing session on startup
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        try {
          // Get additional user data from local storage or session storage
          const storedUser = localStorage.getItem('sishuTirthaUser');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          console.error("Error retrieving stored user:", error);
          // Clear potentially corrupted data
          localStorage.removeItem('sishuTirthaUser');
          setUser(null);
        }
      } else {
        // No user is signed in
        setUser(null);
        localStorage.removeItem('sishuTirthaUser');
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (identifier: string, password: string, role: string) => {
    setLoading(true);
    try {
      let userData: User;
      
      // Special case for admin login
      if (role === 'admin' && identifier.toLowerCase() === 'subhankar.ghorui1995@gmail.com') {
        userData = await loginWithEmail(identifier, password);
      } else {
        // Check if identifier is an email
        if (identifier.includes('@')) {
          // Email login
          userData = await loginWithEmail(identifier, password);
        } else {
          // Username login
          userData = await loginWithUsername(identifier, password, role);
        }
      }
      
      // Verify role
      if (userData.role !== role) {
        throw new Error(`Invalid role. You are not a ${role}`);
      }
      
      setUser(userData);
      localStorage.setItem('sishuTirthaUser', JSON.stringify(userData));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, role: string, name: string) => {
    try {
      await registerUser(email, password, name, role);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Could not create account. Please try again.",
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      localStorage.removeItem('sishuTirthaUser');
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message || "Could not log out. Please try again.",
      });
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      // In Firebase this would call sendPasswordResetEmail
      // For now just show a toast
      toast({
        title: "Reset email sent",
        description: "Check your email to reset your password.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: error.message || "Could not send password reset email. Please try again.",
      });
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
