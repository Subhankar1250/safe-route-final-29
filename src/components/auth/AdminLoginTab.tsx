
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import LoginCredentialFields from './LoginCredentialFields';
import ErrorAlert from './ErrorAlert';
import { Key, RefreshCw } from 'lucide-react';
import { generateCredentials } from '@/utils/authUtils';
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
  const { toast } = useToast();
  const [generatedCredentials, setGeneratedCredentials] = useState<{username: string, password: string} | null>(null);

  const generateAdminCredential = () => {
    // Generate admin credentials using the utility function
    const adminName = "admin" + Math.floor(Math.random() * 100);
    const credentials = generateCredentials(adminName, 'admin');
    
    // Set the generated credentials to the form
    setUsername(credentials.username);
    setPassword(credentials.password);
    setGeneratedCredentials(credentials);
    
    // Show the generated credentials to the user
    toast({
      title: "Admin Credentials Generated",
      description: `Username: ${credentials.username}\nPassword: ${credentials.password}`,
      duration: 10000, // Show for 10 seconds
    });
  };

  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4">
        <ErrorAlert error={error} />
        <LoginCredentialFields 
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
        
        {generatedCredentials && (
          <div className="p-3 bg-blue-50 rounded-md border border-blue-200 text-sm">
            <p><strong>Generated Admin Username:</strong> {generatedCredentials.username}</p>
            <p><strong>Generated Admin Password:</strong> {generatedCredentials.password}</p>
            <p className="text-xs mt-1 text-gray-500">Note: You need to create this user in Supabase before login</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button type="submit" className="w-full bg-sishu-primary hover:bg-blue-700">
          <Key className="mr-2 h-4 w-4" /> Login as Admin
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full text-gray-700"
          onClick={generateAdminCredential}
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Generate Admin Credentials
        </Button>
      </CardFooter>
    </form>
  );
};

export default AdminLoginTab;
