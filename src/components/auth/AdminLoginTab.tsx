
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import LoginCredentialFields from './LoginCredentialFields';
import ErrorAlert from './ErrorAlert';
import { Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoginHandler } from '@/contexts/Auth0Context';

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
  error: propError
}) => {
  const [error, setError] = useState<string | null>(propError);
  const navigate = useNavigate();
  const { handleAdminLogin } = useLoginHandler();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }
    
    const result = handleAdminLogin(username, password);
    
    if (!result.success) {
      setError(result.error || "Invalid credentials");
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <ErrorAlert error={error} />
        <LoginCredentialFields 
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          usernamePlaceholder="Enter admin email"
        />
        
        <div className="text-sm text-gray-500 mt-2">
          <p>Default admin credentials for testing:</p>
          <p>Email: admin@sishu-tirtha.app</p>
          <p>Password: admin123</p>
        </div>
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
