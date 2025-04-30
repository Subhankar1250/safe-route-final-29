
import React from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import LoginCredentialFields from './LoginCredentialFields';
import ErrorAlert from './ErrorAlert';

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
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button type="submit" className="w-full bg-sishu-primary hover:bg-blue-700">
          Login as Admin
        </Button>
      </CardFooter>
    </form>
  );
};

export default AdminLoginTab;
