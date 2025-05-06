
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import LoginCredentialFields from './LoginCredentialFields';
import ErrorAlert from './ErrorAlert';
import { Key, Info } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [showHelper, setShowHelper] = useState(false);
  
  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4">
        <ErrorAlert error={error} />
        <LoginCredentialFields 
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          usernamePlaceholder="Enter admin email"
        />
        
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm text-gray-700">
            {showHelper ? (
              <div className="space-y-2">
                <p>To create your first admin user:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Open your browser console (F12)</li>
                  <li>Use the following code, replacing with your details:</li>
                  <code className="block bg-gray-800 text-white p-2 rounded text-xs mt-2 mb-2">
                    {`// First import the function
import { createAdminUser } from '@/utils/adminCreator';

// Then create your admin
createAdminUser('youremail@example.com', 'securepassword', 'Your Name');`}
                  </code>
                  <li>Login with the created credentials</li>
                </ol>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="mt-2" 
                  onClick={() => setShowHelper(false)}
                >
                  Hide Instructions
                </Button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span>Default admin: admin@sishu-tirtha.app</span>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowHelper(true)}
                >
                  How to Create Admin?
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
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
