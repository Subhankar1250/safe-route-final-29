
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginCredentialFieldsProps {
  username: string;
  password: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  forgotPasswordLink?: boolean;
}

const LoginCredentialFields: React.FC<LoginCredentialFieldsProps> = ({
  username,
  password,
  setUsername,
  setPassword,
  forgotPasswordLink = true
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter your username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {forgotPasswordLink && (
            <a href="#" className="text-sm text-sishu-primary hover:underline">
              Forgot password?
            </a>
          )}
        </div>
        <Input
          id="password"
          type="password" 
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
    </div>
  );
};

export default LoginCredentialFields;
