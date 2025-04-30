
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginCredentialFieldsProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  forgotPasswordLink?: boolean;
}

const LoginCredentialFields: React.FC<LoginCredentialFieldsProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  forgotPasswordLink = true
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="email@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
