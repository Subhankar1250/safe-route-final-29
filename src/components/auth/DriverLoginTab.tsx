
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ScanLine } from "lucide-react";
import LoginCredentialFields from './LoginCredentialFields';
import ErrorAlert from './ErrorAlert';
import QrScanner from './QrScanner';

interface DriverLoginTabProps {
  username: string;
  password: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  error: string | null;
  handleQrCodeScanned: (qrData: string) => void;
  handleScannerError: (error: Error) => void;
}

const DriverLoginTab: React.FC<DriverLoginTabProps> = ({
  username,
  password,
  setUsername,
  setPassword,
  handleLogin,
  error,
  handleQrCodeScanned,
  handleScannerError
}) => {
  const [isScanning, setIsScanning] = useState(false);

  const toggleScanner = () => {
    setIsScanning(!isScanning);
  };

  return (
    <CardContent className="space-y-4">
      <div className="text-center mb-4">
        <p className="font-medium">Login with your QR Code</p>
        <p className="text-sm text-muted-foreground">Scan the QR code provided by your administrator</p>
      </div>
      
      {isScanning ? (
        <div className="relative">
          <QrScanner 
            onScan={handleQrCodeScanned}
            onError={handleScannerError}
          />
          <Button
            type="button"
            variant="outline"
            className="absolute top-2 right-2 rounded-full p-2"
            onClick={toggleScanner}
          >
            &times;
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 w-48 h-48 mx-auto flex items-center justify-center">
          <Button 
            type="button" 
            className="bg-sishu-primary hover:bg-blue-700 flex items-center gap-2"
            onClick={toggleScanner}
          >
            <ScanLine size={16} />
            Scan QR Code
          </Button>
        </div>
      )}
      
      <ErrorAlert error={error} />
      
      <p className="text-xs text-gray-500 text-center mt-4">
        Having trouble scanning? Use your login credentials instead
      </p>
      
      <form onSubmit={handleLogin} className="mt-4 space-y-4">
        <LoginCredentialFields 
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          forgotPasswordLink={false}
        />
        <Button type="submit" className="w-full bg-sishu-primary hover:bg-blue-700">
          Login with Credentials
        </Button>
      </form>
    </CardContent>
  );
};

export default DriverLoginTab;
