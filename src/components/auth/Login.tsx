
import React, { useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Smartphone, Users, Settings } from "lucide-react";
import GuardianLoginTab from './GuardianLoginTab';
import DriverLoginTab from './DriverLoginTab';
import AdminLoginTab from './AdminLoginTab';

// Admin credentials - hardcoded for demonstration
const ADMIN_CREDENTIALS = {
  username: "admin123",
  password: "SafeRoute@2023"
};

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"guardian" | "driver" | "admin">("guardian");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    // Simplified authentication logic
    try {
      // Check for admin credentials
      if (role === "admin" && 
          username === ADMIN_CREDENTIALS.username && 
          password === ADMIN_CREDENTIALS.password) {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        navigate("/admin/dashboard");
        return;
      }

      // Mock authentication for other roles
      if (role === "guardian") {
        if (username.startsWith("SishuTirtha")) {
          toast({
            title: "Guardian login successful",
            description: "Welcome to Sishu Tirtha Safe Route",
          });
          navigate("/guardian/dashboard");
          return;
        }
      } else if (role === "driver") {
        if (username.includes("driver")) {
          toast({
            title: "Driver login successful",
            description: "Welcome to Sishu Tirtha Safe Route",
          });
          navigate("/driver/dashboard");
          return;
        }
      }
      
      setError("Invalid username or password");
    } catch (error) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-16 h-16 mb-2">
            <img 
              src="/logo-placeholder.svg" 
              alt="Sishu Tirtha Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-sishu-primary">Sishu Tirtha Safe Route</CardTitle>
          <CardDescription>Track school transport in real-time</CardDescription>
        </CardHeader>
        
        <Tabs value={role} onValueChange={(value: string) => setRole(value as "guardian" | "driver" | "admin")}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="guardian">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Guardian</span>
            </TabsTrigger>
            <TabsTrigger value="driver">
              <Smartphone className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Driver</span>
            </TabsTrigger>
            <TabsTrigger value="admin">
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Admin</span>
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
    </div>
  );
};

export default Login;
