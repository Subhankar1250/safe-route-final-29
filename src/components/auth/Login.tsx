import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Smartphone, Users, Settings, AlertCircle, ScanLine } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import QrScanner from './QrScanner';

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"guardian" | "driver" | "admin">("guardian");
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Simple validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    toast({
      title: "Logging in...",
      description: `Attempting to log in as ${role}`,
    });
    
    try {
      // Here would go the actual auth logic when integrated with Supabase
      // For now, let's keep the simulated login
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
    setIsScanning(false);
    
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
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
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-sm text-sishu-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password" 
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button type="submit" className="w-full bg-sishu-primary hover:bg-blue-700">Login as Guardian</Button>
                <p className="mt-4 text-center text-sm text-gray-500">
                  Don't have an account?{" "}
                  <a href="#" className="text-sishu-primary hover:underline">
                    Contact school admin
                  </a>
                </p>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="driver">
            <CardContent className="space-y-4">
              <div className="text-center mb-4">
                <p className="font-medium">Login with your QR Code</p>
                <p className="text-sm text-muted-foreground">Scan the QR code provided by your administrator</p>
              </div>
              
              {isScanning ? (
                <div className="relative">
                  <QrScanner 
                    onScan={handleQrCodeScanned}
                    onError={(error: Error) => {
                      setError(error.message);
                      setIsScanning(false);
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="absolute top-2 right-2 rounded-full p-2"
                    onClick={() => setIsScanning(false)}
                  >
                    &times;
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 w-48 h-48 mx-auto flex items-center justify-center">
                  <Button 
                    type="button" 
                    className="bg-sishu-primary hover:bg-blue-700 flex items-center gap-2"
                    onClick={() => setIsScanning(true)}
                  >
                    <ScanLine size={16} />
                    Scan QR Code
                  </Button>
                </div>
              )}
              
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Having trouble scanning? Use your login credentials instead
              </p>
              
              <form onSubmit={handleLogin} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="driver-email">Email/Username</Label>
                  <Input
                    id="driver-email"
                    type="email"
                    placeholder="email@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver-password">Password</Label>
                  <Input
                    id="driver-password"
                    type="password" 
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full bg-sishu-primary hover:bg-blue-700">
                  Login with Credentials
                </Button>
              </form>
            </CardContent>
          </TabsContent>

          <TabsContent value="admin">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="admin-password">Password</Label>
                    <a href="#" className="text-sm text-sishu-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="admin-password"
                    type="password" 
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button type="submit" className="w-full bg-sishu-primary hover:bg-blue-700">Login as Admin</Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
