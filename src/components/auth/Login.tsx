import React, { useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Smartphone, Users, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import GuardianLoginTab from './GuardianLoginTab';
import DriverLoginTab from './DriverLoginTab';
import AdminLoginTab from './AdminLoginTab';

const Login: React.FC = () => {
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
      // Here would be the actual auth logic when integrated with Supabase
      // We'll use JWT with username-password authentication
      
      // Simulated login for now
      setTimeout(() => {
        if (role === "guardian") {
          navigate("/guardian/dashboard");
        } else if (role === "driver") {
          navigate("/driver/dashboard");
        } else if (role === "admin") {
          navigate("/admin/dashboard");
        }
      }, 1500);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "Failed to authenticate. Please try again.",
      });
    }
  };

  const handleQrCodeScanned = (qrData: string) => {
    // Process the QR code data
    if (qrData.startsWith('driver_')) {
      toast({
        title: "QR Code Detected",
        description: "Authenticating with driver QR code...",
      });
      
      // Here you would verify the QR code with your backend
      // For now, navigate directly to the driver dashboard
      setTimeout(() => {
        navigate("/driver/dashboard");
      }, 1500);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <img src="/logo-placeholder.svg" alt="Sishu Tirtha Safe Route" className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl font-bold text-sishu-primary">Sishu Tirtha Safe Route</CardTitle>
          <CardDescription>The safest route for your child's journey</CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="guardian" className="w-full" onValueChange={(value) => setRole(value as "guardian" | "driver" | "admin")}>
          <TabsList className="grid grid-cols-3 mb-4 mx-4">
            <TabsTrigger value="guardian" className="flex items-center gap-2">
              <Users size={16} /> Guardian
            </TabsTrigger>
            <TabsTrigger value="driver" className="flex items-center gap-2">
              <Smartphone size={16} /> Driver
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Settings size={16} /> Admin
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="guardian">
            <GuardianLoginTab
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
              handleLogin={handleLogin}
              error={error}
            />
          </TabsContent>
          
          <TabsContent value="driver">
            <DriverLoginTab
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
              handleLogin={handleLogin}
              error={error}
              handleQrCodeScanned={handleQrCodeScanned}
              handleScannerError={handleScannerError}
            />
          </TabsContent>

          <TabsContent value="admin">
            <AdminLoginTab
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
              handleLogin={handleLogin}
              error={error}
            />
          </TabsContent>
        </Tabs>
      </Card>
      
      {/* Fixed Footer Text */}
      <div className="w-full max-w-md mt-4 bg-sishu-primary text-white rounded-md p-2 text-center">
        <p className="text-sm">Developed By : The Phoenix Devs.</p>
        <p className="text-sm">Created By : Subhankar Ghorui</p>
      </div>
    </div>
  );
};

export default Login;
