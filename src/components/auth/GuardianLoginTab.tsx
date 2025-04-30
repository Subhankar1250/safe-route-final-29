
import React from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import LoginCredentialFields from './LoginCredentialFields';
import ErrorAlert from './ErrorAlert';

interface GuardianLoginTabProps {
  username: string;
  password: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  error: string | null;
}

const GuardianLoginTab: React.FC<GuardianLoginTabProps> = ({
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
          usernamePlaceholder="SishuTirthaStudentName1234"
        />
        <div className="text-xs text-muted-foreground">
          <p>Your username starts with "SishuTirtha" followed by your child's name and numbers</p>
          <p>If you don't know your login details, please contact the school administrator</p>
        </div>
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
