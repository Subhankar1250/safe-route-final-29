
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';
import { DriverOption, BusOption, DriverQRCode } from '@/types/qrcode.types';

interface QRCodeGeneratorProps {
  driverOptions: DriverOption[];
  busOptions: BusOption[];
  onQRCodeGenerated: (qrCode: DriverQRCode) => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ driverOptions, busOptions, onQRCodeGenerated }) => {
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [selectedBus, setSelectedBus] = useState<string>('');
  const [currentQRCode, setCurrentQRCode] = useState<string>('');
  const qrRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const generateQRCode = () => {
    if (!selectedDriver || !selectedBus) {
      toast({
        title: 'Error',
        description: 'Please select both a driver and a bus',
        variant: 'destructive',
      });
      return;
    }

    const selectedDriverName = driverOptions.find(d => d.id === selectedDriver)?.name || '';
    
    // Generate QR code data
    const qrData = `driver_${selectedDriver}_${selectedBus}_${Date.now()}`;
    
    // In a real app, you'd save this to Firestore
    
    // Create a new QR code entry
    const newQRCode: DriverQRCode = {
      id: Date.now().toString(),
      driverName: selectedDriverName,
      busNumber: selectedBus,
      generated: new Date(),
      qrData
    };
    
    onQRCodeGenerated(newQRCode);
    setCurrentQRCode(qrData);
    
    toast({
      title: 'Success',
      description: 'QR code generated successfully',
    });
  };

  const downloadQRCode = () => {
    if (!qrRef.current || !currentQRCode) return;
    
    // Get the SVG element
    const svgElement = qrRef.current.querySelector('svg');
    if (!svgElement) return;
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const svgRect = svgElement.getBoundingClientRect();
    canvas.width = svgRect.width;
    canvas.height = svgRect.height;
    
    // Create an image element from the SVG
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    img.onload = () => {
      // Draw the image to the canvas
      ctx.drawImage(img, 0, 0);
      
      // Convert the canvas to a data URL and trigger a download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `driver_qr_${selectedBus || 'code'}.png`;
      link.href = dataUrl;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="driver">Select Driver</Label>
        <select 
          id="driver"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
        >
          <option value="">Select Driver</option>
          {driverOptions.map(driver => (
            <option key={driver.id} value={driver.id}>{driver.name}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bus">Select Bus</Label>
        <select 
          id="bus"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={selectedBus}
          onChange={(e) => setSelectedBus(e.target.value)}
        >
          <option value="">Select Bus</option>
          {busOptions.map(bus => (
            <option key={bus.id} value={bus.id}>{bus.name}</option>
          ))}
        </select>
      </div>
      
      <Button onClick={generateQRCode} className="w-full">
        Generate QR Code
      </Button>
      
      {currentQRCode && (
        <div className="flex flex-col items-center mt-4">
          <div ref={qrRef} className="border rounded-lg p-4 bg-white">
            <QRCodeSVG value={currentQRCode} size={240} />
          </div>
          <Button 
            onClick={downloadQRCode} 
            variant="outline" 
            className="mt-2"
          >
            <Download className="mr-2 h-4 w-4" /> Download QR Code
          </Button>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
