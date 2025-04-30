
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import LoginCredentialFields from './LoginCredentialFields';
import ErrorAlert from './ErrorAlert';
import QrScanner from './QrScanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { QrCode, User } from 'lucide-react';

interface DriverLoginTabProps {
  username: string;
  password: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  error: string | null;
  handleQrCodeScanned?: (qrData: string) => void; // Added this prop
  handleScannerError?: (error: Error) => void;    // Added this prop
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
  const [loginMethod, setLoginMethod] = useState<"credentials" | "qr">("credentials");
  const { toast } = useToast();
  
  // Handle QR scan result
  const handleQRScan = (decodedText: string) => {
    try {
      const loginData = JSON.parse(decodedText);
      
      if (loginData.token) {
        // In a real app, you would validate this token with your backend
        toast({
          title: "QR Code Detected",
          description: "Processing login via QR code...",
        });
        
        // If we also have username and password, we can auto-fill the form
        if (loginData.username && loginData.password) {
          setUsername(loginData.username);
          setPassword(loginData.password);
          
          // In a real implementation, you would handle the form submission automatically
          // For now, we'll just set the fields and notify the user
          setLoginMethod("credentials");
          
          toast({
            title: "Login Info Retrieved",
            description: "Username and password auto-filled. Please click Login to continue.",
          });
        } else {
          // If we only have the token, we would directly authenticate with it
          // For this demo, we'll show a toast
          toast({
            title: "Success",
            description: "QR code login successful!",
          });
        }
      } else {
        throw new Error("Invalid QR code format");
      }
      
      // Forward the QR code data to the parent component if the handler exists
      if (handleQrCodeScanned) {
        handleQrCodeScanned(decodedText);
      }
    } catch (err) {
      toast({
        title: "Invalid QR Code",
        description: "The scanned QR code is not valid for login.",
        variant: "destructive"
      });
    }
  };
  
  // Handle QR scan error
  const handleQRError = (error: Error) => {
    toast({
      title: "QR Scan Error",
      description: error.message,
      variant: "destructive"
    });
    
    // Forward the error to the parent component if the handler exists
    if (handleScannerError) {
      handleScannerError(error);
    }
  };
  
  return (
    <Tabs value={loginMethod} onValueChange={(value: string) => setLoginMethod(value as "credentials" | "qr")}>
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="credentials">
          <User className="mr-2 h-4 w-4" /> Username & Password
        </TabsTrigger>
        <TabsTrigger value="qr">
          <QrCode className="mr-2 h-4 w-4" /> QR Code
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="credentials">
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
              Login as Driver
            </Button>
          </CardFooter>
        </form>
      </TabsContent>
      
      <TabsContent value="qr">
        <CardContent className="space-y-4 flex flex-col items-center justify-center">
          <ErrorAlert error={error} />
          <p className="text-sm text-center text-muted-foreground">
            Scan your driver QR code to log in instantly
          </p>
          <QrScanner 
            onScan={handleQRScan}
            onError={handleQRError}
          />
        </CardContent>
      </TabsContent>
    </Tabs>
  );
};

export default DriverLoginTab;
