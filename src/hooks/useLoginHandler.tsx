
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useLoginHandler = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"guardian" | "driver" | "admin">("guardian");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, user } = useSupabaseAuth();

  // Pre-fill admin credentials if admin role is selected
  useEffect(() => {
    if (role === "admin") {
      setUsername("admin@sisthutirtha.com");
      setPassword("Suvo@1250");
    }
  }, [role]);

  useEffect(() => {
    // If user is already logged in, redirect based on role
    if (user) {
      // Check user role from Supabase
      const checkUserRole = async () => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          
          if (data) {
            const userRole = data.role;
            
            // Navigate based on role
            if (userRole === 'guardian') {
              navigate('/guardian/dashboard');
            } else if (userRole === 'driver') {
              navigate('/driver/dashboard');
            } else if (userRole === 'admin') {
              navigate('/admin/dashboard');
            }
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      };

      checkUserRole();
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Simple validation
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }
    
    toast({
      title: "Logging in...",
      description: `Attempting to log in as ${role}`,
    });
    
    try {
      // Convert username to email format if needed
      const email = username.includes('@') ? username : `${username.toLowerCase()}@sishu-tirtha.app`;
      
      // Supabase Authentication
      await login(email, password);
      
      // The auth state change listener will handle navigation
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleQrCodeScanned = async (qrData: string) => {
    // Process the QR code data for driver login
    if (qrData.startsWith('driver_')) {
      toast({
        title: "QR Code Detected",
        description: "Authenticating with driver QR code...",
      });
      
      try {
        // Check for this QR token in the credentials table
        const { data, error } = await supabase
          .from('credentials')
          .select('username, password')
          .eq('qr_token', qrData)
          .eq('role', 'driver')
          .single();
        
        if (error || !data) {
          throw new Error("Invalid QR code");
        }
        
        // Auto fill the form with retrieved credentials
        setUsername(data.username);
        setPassword(data.password);
        setRole('driver');
        
        // Submit the form
        await login(data.username, data.password);
        
      } catch (error) {
        setError("Invalid QR code. Please try again or use your credentials.");
        toast({
          variant: "destructive",
          title: "QR Authentication Failed",
          description: "Could not authenticate with QR code.",
        });
      }
    } else {
      setError("Invalid QR code. Please try again or use your credentials.");
    }
  };

  const handleScannerError = (error: Error) => {
    setError(`Scanner error: ${error.message}`);
    toast({
      variant: "destructive",
      title: "Scanner Error",
      description: error.message,
    });
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    role,
    setRole,
    error,
    handleLogin,
    handleQrCodeScanned,
    handleScannerError
  };
};
