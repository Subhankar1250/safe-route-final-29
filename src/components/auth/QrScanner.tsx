
import React, { useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

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
  useEffect(() => {
    // Create a unique ID for the scanner element
    const scannerId = 'html5-qr-code-scanner';
    
    // Initialize the scanner
    const html5QrCode = new Html5Qrcode(scannerId);
    
    // Start scanning
    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" }, // Use the back camera
          {
            fps,
            qrbox,
            aspectRatio: 1.0,
            disableFlip: false,
          },
          (decodedText) => {
            // On successful scan
            html5QrCode.stop();
            onScan(decodedText);
          },
          (errorMessage) => {
            // QR code processing error (ignored to prevent flooding errors)
          }
        );
      } catch (err) {
        // Camera access or other startup error
        onError(err as Error);
      }
    };
    
    startScanner();
    
    // Cleanup function
    return () => {
      html5QrCode.stop().catch(err => console.error("Failed to stop camera:", err));
    };
  }, [onScan, onError, qrbox, fps]);
  
  return (
    <div className="w-full flex justify-center">
      <div 
        id="html5-qr-code-scanner" 
        className="w-full max-w-sm aspect-square border rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default QrScanner;
