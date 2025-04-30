
import React from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import LoginCredentialFields from './LoginCredentialFields';
import ErrorAlert from './ErrorAlert';

interface AdminLoginTabProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  error: string | null;
}

const AdminLoginTab: React.FC<AdminLoginTabProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  handleLogin,
  error
}) => {
  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4">
        <ErrorAlert error={error} />
        <LoginCredentialFields 
          email={email}
          password={password}
          setEmail={setEmail}
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
