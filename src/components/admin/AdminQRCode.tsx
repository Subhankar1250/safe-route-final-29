
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useFirebase } from '@/contexts/FirebaseContext';
import { Plus, Download, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { QRCodeSVG } from 'qrcode.react';

interface DriverQRCode {
  id: string;
  driverName: string;
  busNumber: string;
  generated: Date;
  qrData: string;
}

const mockQRCodes: DriverQRCode[] = [
  { 
    id: '1', 
    driverName: 'John Doe', 
    busNumber: 'BUS001', 
    generated: new Date(2023, 2, 15), 
    qrData: 'driver_1_BUS001' 
  },
  { 
    id: '2', 
    driverName: 'Jane Smith', 
    busNumber: 'BUS002', 
    generated: new Date(2023, 2, 20), 
    qrData: 'driver_2_BUS002' 
  },
];

const AdminQRCode: React.FC = () => {
  const [driverQRCodes, setDriverQRCodes] = useState<DriverQRCode[]>(mockQRCodes);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [selectedBus, setSelectedBus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentQRCode, setCurrentQRCode] = useState<string>('');
  const qrRef = React.useRef<HTMLDivElement>(null);

  const { firestore } = useFirebase();
  const { toast } = useToast();

  // Mock data for dropdowns
  const driverOptions = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Mike Johnson' },
  ];

  const busOptions = [
    { id: 'BUS001', name: 'BUS001' },
    { id: 'BUS002', name: 'BUS002' },
    { id: 'BUS003', name: 'BUS003' },
  ];

  const filteredQRCodes = driverQRCodes.filter(qr => 
    qr.driverName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    qr.busNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    
    // Add to the local state
    const newQRCode: DriverQRCode = {
      id: Date.now().toString(),
      driverName: selectedDriverName,
      busNumber: selectedBus,
      generated: new Date(),
      qrData
    };
    
    setDriverQRCodes([...driverQRCodes, newQRCode]);
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

  const viewQRCode = (qrData: string) => {
    setCurrentQRCode(qrData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Driver QR Codes</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search QR codes..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Generate QR Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Driver QR Code</DialogTitle>
              </DialogHeader>
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
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Driver</TableHead>
            <TableHead>Bus Number</TableHead>
            <TableHead>Generated Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredQRCodes.map((qrCode) => (
            <TableRow key={qrCode.id}>
              <TableCell>{qrCode.driverName}</TableCell>
              <TableCell>{qrCode.busNumber}</TableCell>
              <TableCell>{qrCode.generated.toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => viewQRCode(qrCode.qrData)}
                >
                  View QR
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {currentQRCode && (
        <div className="flex flex-col items-center mt-4 p-4 border rounded-lg">
          <h3 className="font-medium mb-4">QR Code Preview</h3>
          <div ref={qrRef} className="border rounded-lg p-4 bg-white">
            <QRCodeSVG value={currentQRCode} size={240} />
          </div>
          <Button 
            onClick={downloadQRCode} 
            variant="outline" 
            className="mt-4"
          >
            <Download className="mr-2 h-4 w-4" /> Download QR Code
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminQRCode;
