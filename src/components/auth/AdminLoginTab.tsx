
import React from 'react';
import { AlertCircle } from 'lucide-react';
import LoginCredentialFields from './LoginCredentialFields';

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
    <div className="space-y-4 p-4">
      <LoginCredentialFields
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        showForgotPassword={false}
      />
      
      {error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-start space-x-2 text-sm">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="text-destructive">{error}</div>
        </div>
      )}
      
      <button
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
        onClick={handleLogin}
      >
        Sign In
      </button>
    </div>
  );
};

export default AdminLoginTab;
