
import React, { useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Smartphone, Users, Settings, ArrowRight } from "lucide-react";
import GuardianLoginTab from './GuardianLoginTab';
import DriverLoginTab from './DriverLoginTab';
import AdminLoginTab from './AdminLoginTab';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useFirebase } from '@/contexts/FirebaseContext';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"guardian" | "driver" | "admin">("guardian");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { auth, firestore } = useFirebase();

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
      // Convert username to email format for Firebase Auth
      // This is just for demonstration - in a real app, you might have a different strategy
      const email = `${username.toLowerCase()}@sishu-tirtha.app`;
      
      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check user role in Firestore
      const userRoleQuery = query(
        collection(firestore, "users"),
        where("uid", "==", user.uid)
      );
      
      const querySnapshot = await getDocs(userRoleQuery);
      
      if (querySnapshot.empty) {
        throw new Error("User role not found");
      }
      
      const userData = querySnapshot.docs[0].data();
      const userRole = userData.role;
      
      // Validate correct role was selected
      if (userRole !== role) {
        setError(`You are not authorized as a ${role}. Please select the correct role.`);
        await auth.signOut();
        return;
      }
      
      // Navigate based on role
      if (role === "guardian") {
        navigate("/guardian/dashboard");
      } else if (role === "driver") {
        navigate("/driver/dashboard");
      } else if (role === "admin") {
        navigate("/admin/dashboard");
      }
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name || username}!`,
      });
      
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials.");
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "Failed to authenticate. Please try again.",
      });
    }
  };

  const handleQrCodeScanned = async (qrData: string) => {
    // Process the QR code data
    if (qrData.startsWith('driver_')) {
      toast({
        title: "QR Code Detected",
        description: "Authenticating with driver QR code...",
      });
      
      try {
        // Here you would verify the QR code with your backend/Firebase
        // For demonstration:
        const driverId = qrData.replace('driver_', '');
        
        // Query Firestore for this driver
        const driverQuery = query(
          collection(firestore, "users"),
          where("driverId", "==", driverId),
          where("role", "==", "driver")
        );
        
        const querySnapshot = await getDocs(driverQuery);
        
        if (querySnapshot.empty) {
          throw new Error("Driver not found");
        }
        
        // Auto login the driver
        navigate("/driver/dashboard");
        
        toast({
          title: "QR Login successful",
          description: "Welcome back!",
        });
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <img 
              src="/lovable-uploads/5660de73-133f-4d61-aa57-08b2be7b455d.png" 
              alt="Sishu Tirtha Safe Route" 
              className="h-24 w-24" 
            />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Sishu Tirtha Safe Route</CardTitle>
          <div className="flex items-center justify-center space-x-1 text-sm">
            <span>Baradongal</span>
            <ArrowRight className="h-4 w-4" />
            <span>Arambagh</span>
            <ArrowRight className="h-4 w-4" />
            <span>Hooghly</span>
          </div>
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
      <div className="w-full max-w-md mt-4 bg-primary text-white rounded-md p-2 text-center">
        <p className="text-sm">Developed By : The Phoenix Devs.</p>
        <p className="text-sm">Created By : Subhankar Ghorui</p>
      </div>
    </div>
  );
};

export default Login;
