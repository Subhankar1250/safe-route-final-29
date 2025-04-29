
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Smartphone, Users, Settings } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"guardian" | "driver" | "admin">("guardian");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here would go the actual auth logic
    toast({
      title: "Logging in...",
      description: `Attempting to log in as ${role}`,
    });
    
    // Simulate login and redirect
    setTimeout(() => {
      if (role === "guardian") {
        navigate("/guardian/dashboard");
      } else if (role === "driver") {
        navigate("/driver/dashboard");
      } else if (role === "admin") {
        navigate("/admin/dashboard");
      }
    }, 1500);
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
            <CardContent className="space-y-4 flex flex-col items-center">
              <div className="text-center mb-4">
                <p className="font-medium">Login with your QR Code</p>
                <p className="text-sm text-muted-foreground">Scan the QR code provided by your administrator</p>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 w-48 h-48 flex items-center justify-center">
                <Button type="button" className="bg-sishu-primary hover:bg-blue-700">
                  Scan QR Code
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Having trouble scanning? Contact your school administrator
              </p>
            </CardContent>
          </TabsContent>

          <TabsContent value="admin">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
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
