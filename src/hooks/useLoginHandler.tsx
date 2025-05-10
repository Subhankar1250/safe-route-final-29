
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useLoginHandler = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<"guardian" | "driver" | "admin">('guardian');
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Please enter both username/email and password');
      return;
    }

    try {
      await login(username, password, role);
      
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'driver') {
        navigate('/driver/dashboard');
      } else if (role === 'guardian') {
        navigate('/guardian/dashboard');
      }
    } catch (error: any) {
      setError(error.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // For QR code scanning in driver login
  const handleQrCodeScanned = async (data: string) => {
    try {
      const qrData = JSON.parse(data);
      if (qrData.token && qrData.username && qrData.password) {
        setUsername(qrData.username);
        setPassword(qrData.password);
        setRole('driver');
        
        // Automatically login with scanned credentials
        await login(qrData.username, qrData.password, 'driver');
        navigate('/driver/dashboard');
        
        toast({
          title: "QR Login Successful",
          description: "You have been logged in using QR code",
        });
      } else {
        throw new Error("Invalid QR code format");
      }
    } catch (error: any) {
      console.error("QR code scan error:", error);
      setError(error.message || "Could not log in with QR code");
      toast({
        variant: "destructive",
        title: "QR Login Failed",
        description: "Invalid QR code or credentials",
      });
    }
  };

  const handleScannerError = (error: Error) => {
    console.error("Scanner error:", error);
    setError("QR scanner error: " + error.message);
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
    handleLogout,
    handleQrCodeScanned,
    handleScannerError
  };
};

export default useLoginHandler;
