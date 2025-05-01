
import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smartphone, Users, Settings } from "lucide-react";
import GuardianLoginTab from './GuardianLoginTab';
import DriverLoginTab from './DriverLoginTab';
import AdminLoginTab from './AdminLoginTab';
import LoginHeader from './LoginHeader';
import LoginFooter from './LoginFooter';
import { useLoginHandler } from '@/hooks/useLoginHandler';

const Login: React.FC = () => {
  const { 
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
  } = useLoginHandler();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md mx-auto">
        <LoginHeader />
        
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
      
      <LoginFooter />
    </div>
  );
};

export default Login;
