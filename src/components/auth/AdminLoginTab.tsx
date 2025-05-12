
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import LoginCredentialFields from './LoginCredentialFields';
import ErrorAlert from './ErrorAlert';
import { Key } from 'lucide-react';
import { initializeRealAdmin } from '@/utils/initializeAdmin';
import { useToast } from '@/components/ui/use-toast';

interface AdminLoginTabProps {
  username: string;
  password: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  error: string | null;
}

const AdminLoginTab: React.FC<AdminLoginTabProps> = ({
  username,
  password,
  setUsername,
  setPassword,
  handleLogin,
  error
}) => {
  const [initializing, setInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // This function should only be used in development
  const handleInitializeAdmin = async () => {
    setInitializing(true);
    setInitError(null);
    try {
      console.log("Starting admin initialization...");
      const result = await initializeRealAdmin();
      if (result) {
        toast({
          title: "Admin Created",
          description: "The admin account has been initialized successfully. You can now log in.",
        });
        // Auto-fill the credentials for convenience
        setUsername("subhankar.ghorui1111@gmail.com");
        setPassword("Suvo@1250");
      } else {
        setInitError("Failed to create admin account. Check console for details.");
        toast({
          variant: "destructive",
          title: "Failed",
          description: "Could not create admin account, check console for details",
        });
      }
    } catch (error: any) {
      console.error("Admin initialization error:", error);
      setInitError(error.message || "An unexpected error occurred");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setInitializing(false);
    }
  };
  
  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4">
        <ErrorAlert error={error || initError} />
        <LoginCredentialFields 
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          usernamePlaceholder="Enter admin email"
        />
        
        <div className="text-sm text-gray-500 mt-2">
          <p>Use the official admin email to login</p>
          <p>Email: subhankar.ghorui1111@gmail.com</p>
        </div>
        
        {/* Only show in development mode */}
        {import.meta.env.DEV && (
          <Button 
            type="button" 
            variant="outline" 
            className="w-full text-xs"
            onClick={handleInitializeAdmin}
            disabled={initializing}
          >
            {initializing ? "Creating Admin..." : "Initialize Admin Account (Dev Only)"}
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button type="submit" className="w-full bg-sishu-primary hover:bg-blue-700">
          <Key className="mr-2 h-4 w-4" /> Login as Admin
        </Button>
      </CardFooter>
    </form>
  );
};

export default AdminLoginTab;
