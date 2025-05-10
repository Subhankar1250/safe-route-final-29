
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const useLoginHandler = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"guardian" | "driver" | "admin">("guardian");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      // Simple demo credentials for testing
      if (role === 'guardian') {
        if (username === 'guardian' && password === 'guardian123') {
          toast({
            title: "Login successful",
            description: "Welcome, Guardian!"
          });
          navigate('/guardian/dashboard');
          return;
        }
      } else if (role === 'driver') {
        if (username === 'driver' && password === 'driver123') {
          toast({
            title: "Login successful",
            description: "Welcome, Driver!"
          });
          navigate('/driver/dashboard');
          return;
        }
      } else if (role === 'admin') {
        if (username === 'admin@sishu-tirtha.app' && password === 'admin123') {
          toast({
            title: "Login successful",
            description: "Welcome, Admin!"
          });
          navigate('/admin/dashboard');
          return;
        }
      }
      
      // If we got here, login failed
      throw new Error("Invalid credentials");
      
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials.");
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err.message || "Please check your credentials and try again."
      });
    }
  };

  const handleQrCodeScanned = async (qrData: string) => {
    // Simple demo QR code handling
    if (qrData === 'driver_test_qr_code') {
      toast({
        title: "QR Code Detected",
        description: "Authenticating with driver QR code...",
      });
      
      // Auto fill the form with demo credentials
      setUsername('driver');
      setPassword('driver123');
      setRole('driver');
      
      // Submit the form - in real app, would validate QR token
      navigate('/driver/dashboard');
    } else {
      setError("Invalid QR code. Please try again or use your credentials.");
      toast({
        variant: "destructive",
        title: "QR Authentication Failed",
        description: "Could not authenticate with QR code.",
      });
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
