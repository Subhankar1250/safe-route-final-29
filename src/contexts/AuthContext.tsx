
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useToast } from '@/components/ui/use-toast';

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

// Create mock users for testing
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@sishu-tirtha.app',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'driver@example.com',
    name: 'Driver User',
    role: 'driver',
  },
  {
    id: '3',
    email: 'guardian@example.com',
    name: 'Guardian User',
    role: 'guardian',
  }
];

// Store credentials in a separate object for authentication
const mockCredentials: Record<string, string> = {
  'admin@sishu-tirtha.app': 'admin123',
  'driver@example.com': 'driver123',
  'guardian@example.com': 'guardian123',
};

// Guardian usernames
const guardianUsernames: Record<string, string> = {
  'guardian1': 'guardian123',
  'guardian2': 'guardian123',
  'guardian3': 'guardian123',
};

// Driver usernames
const driverUsernames: Record<string, string> = {
  'driver1': 'driver123',
  'driver2': 'driver123',
  'driver3': 'driver123',
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if we have a user in localStorage
    const storedUser = localStorage.getItem('sishuTirthaUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (identifier: string, password: string, role: string) => {
    setLoading(true);
    try {
      // For email login
      if (identifier.includes('@')) {
        const email = identifier;
        // Check credentials
        if (mockCredentials[email] !== password) {
          throw new Error('Invalid email or password');
        }

        // Find user
        const matchedUser = mockUsers.find(u => u.email === email);
        if (!matchedUser) {
          throw new Error('User not found');
        }

        // Check role
        if (matchedUser.role !== role) {
          throw new Error(`Invalid role. You are not a ${role}`);
        }

        setUser(matchedUser);
        localStorage.setItem('sishuTirthaUser', JSON.stringify(matchedUser));

        toast({
          title: "Login successful",
          description: `Welcome back, ${matchedUser.name}!`,
        });
      } 
      // For username login (drivers)
      else if (role === 'driver') {
        if (!driverUsernames[identifier] || driverUsernames[identifier] !== password) {
          throw new Error('Invalid driver credentials');
        }

        const driverUser: User = {
          id: `driver-${Date.now()}`,
          email: `${identifier}@driver.sishu-tirtha.app`,
          name: `Driver ${identifier.replace('driver', '')}`,
          role: 'driver'
        };

        setUser(driverUser);
        localStorage.setItem('sishuTirthaUser', JSON.stringify(driverUser));

        toast({
          title: "Driver login successful",
          description: `Welcome back, ${driverUser.name}!`,
        });
      }
      // For username login (guardians)
      else if (role === 'guardian') {
        if (!guardianUsernames[identifier] || guardianUsernames[identifier] !== password) {
          throw new Error('Invalid guardian credentials');
        }

        const guardianUser: User = {
          id: `guardian-${Date.now()}`,
          email: `${identifier}@guardian.sishu-tirtha.app`,
          name: `Guardian ${identifier.replace('guardian', '')}`,
          role: 'guardian'
        };

        setUser(guardianUser);
        localStorage.setItem('sishuTirthaUser', JSON.stringify(guardianUser));

        toast({
          title: "Guardian login successful",
          description: `Welcome back, ${guardianUser.name}!`,
        });
      } else {
        throw new Error('Invalid login type');
      }
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
      // In a real app, this would call an API
      // For now, we'll just add to our mock data
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: role as 'admin' | 'driver' | 'guardian',
      };
      
      // In a real app, this would be saved to a database
      mockUsers.push(newUser);
      mockCredentials[email] = password;

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
  const logout = () => {
    setUser(null);
    localStorage.removeItem('sishuTirthaUser');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      // In a real app, this would send a reset email
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
