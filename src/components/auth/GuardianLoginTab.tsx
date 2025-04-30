
import React from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import LoginCredentialFields from './LoginCredentialFields';
import ErrorAlert from './ErrorAlert';

interface GuardianLoginTabProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  error: string | null;
}

const GuardianLoginTab: React.FC<GuardianLoginTabProps> = ({
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
          Login as Guardian
        </Button>
        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="#" className="text-sishu-primary hover:underline">
            Contact school admin
          </a>
        </p>
      </CardFooter>
    </form>
  );
};

export default GuardianLoginTab;
