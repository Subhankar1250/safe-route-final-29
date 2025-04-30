
import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';

interface QrScannerProps {
  onScan: (decodedText: string) => void;
  onError: (error: Error) => void;
  qrbox?: number;
  fps?: number;
}

const QrScanner: React.FC<QrScannerProps> = ({
  onScan,
  onError,
  qrbox = 250,
  fps = 10
}) => {
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  useEffect(() => {
    // Create a unique ID for the scanner element
    const scannerId = 'html5-qr-code-scanner';
    
    // Initialize the scanner
    const html5QrCode = new Html5Qrcode(scannerId);
    setScanner(html5QrCode);
    
    // Cleanup function
    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Failed to stop camera:", err));
      }
    };
  }, []);

  const startScanner = async () => {
    if (!scanner) return;
    
    setCameraError(null);
    setScanning(true);
    
    try {
      await scanner.start(
        { facingMode: "environment" }, // Use the back camera
        {
          fps,
          qrbox,
          aspectRatio: 1.0,
          disableFlip: false,
        },
        (decodedText) => {
          // On successful scan
          stopScanner();
          onScan(decodedText);
        },
        (errorMessage) => {
          // QR code processing error (ignored to prevent flooding errors)
        }
      );
    } catch (err) {
      // Camera access or other startup error
      setScanning(false);
      setCameraError((err as Error).message || "Failed to access camera");
      onError(err as Error);
    }
  };
  
  const stopScanner = () => {
    if (scanner && scanner.isScanning) {
      scanner.stop().catch(err => console.error("Failed to stop camera:", err));
      setScanning(false);
    }
  };
  
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <div 
        id="html5-qr-code-scanner" 
        className="w-full max-w-sm aspect-square border rounded-lg overflow-hidden"
      />
      
      {cameraError && (
        <div className="text-red-500 text-sm text-center p-2">
          {cameraError}
          <p className="mt-1">Please ensure you've granted camera permissions.</p>
        </div>
      )}
      
      <div className="flex gap-2">
        {!scanning ? (
          <Button 
            type="button"
            onClick={startScanner}
            className="bg-sishu-primary hover:bg-blue-700"
          >
            Start Camera
          </Button>
        ) : (
          <Button 
            type="button"
            onClick={stopScanner}
            variant="outline"
          >
            Stop Camera
          </Button>
        )}
      </div>
    </div>
  );
};

export default QrScanner;
