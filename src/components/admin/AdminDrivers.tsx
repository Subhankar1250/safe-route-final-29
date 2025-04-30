
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { useFirebase } from '@/contexts/FirebaseContext';
import { Plus, Edit, Trash, Search, QrCode } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { generateCredentials } from '@/utils/authUtils';
import { QRCodeSVG } from 'qrcode.react';

interface Driver {
  id: string;
  name: string;
  phone: string;
  license: string;
  busNumber: string;
  status: "active" | "inactive";
  username: string;
  password: string;
  qrToken: string;
}

const mockDrivers: Driver[] = [
  { 
    id: '1', 
    name: 'John Doe', 
    phone: '555-1234', 
    license: 'DL12345', 
    busNumber: 'BUS001', 
    status: "active",
    username: 'johndoe1234',
    password: 'securePass123',
    qrToken: 'driver_token_12345'
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    phone: '555-5678', 
    license: 'DL67890', 
    busNumber: 'BUS002', 
    status: "active",
    username: 'janesmith5678',
    password: 'securePass456',
    qrToken: 'driver_token_67890'
  },
  { 
    id: '3', 
    name: 'Bob Johnson', 
    phone: '555-9012', 
    license: 'DL45678', 
    busNumber: 'BUS003', 
    status: "inactive",
    username: 'bobjohnson9012',
    password: 'securePass789',
    qrToken: 'driver_token_54321'
  },
];

const AdminDrivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [searchTerm, setSearchTerm] = useState('');
  const [newDriver, setNewDriver] = useState<Omit<Driver, 'id' | 'username' | 'password' | 'qrToken'>>({
    name: '',
    phone: '',
    license: '',
    busNumber: '',
    status: 'active',
  });
  const [currentQrCode, setCurrentQrCode] = useState<string | null>(null);
  const [selectedDriverCredentials, setSelectedDriverCredentials] = useState<{username: string, password: string} | null>(null);

  const { firestore } = useFirebase();
  const { toast } = useToast();

  // Filter drivers based on search term
  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    driver.phone.includes(searchTerm) ||
    driver.busNumber.includes(searchTerm)
  );
  
  // Add new driver with auto-generated credentials and QR code token
  const handleAddDriver = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const credentials = generateCredentials(newDriver.name, 'driver');
    const qrToken = `driver_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create a new driver with credentials and QR token
    const driver: Driver = {
      ...newDriver,
      id,
      username: credentials.username,
      password: credentials.password,
      qrToken
    };
    
    setDrivers([...drivers, driver]);
    
    // Show the QR code with credentials
    setCurrentQrCode(JSON.stringify({
      token: qrToken,
      username: credentials.username,
      password: credentials.password
    }));
    
    setSelectedDriverCredentials({
      username: credentials.username,
      password: credentials.password
    });
    
    toast({
      title: 'Success',
      description: 'New driver added successfully with auto-generated login credentials',
    });
  };

  const handleDeleteDriver = (id: string) => {
    setDrivers(drivers.filter(driver => driver.id !== id));
    toast({
      title: 'Success',
      description: 'Driver deleted successfully',
    });
  };

  const viewDriverQrCode = (driver: Driver) => {
    setCurrentQrCode(JSON.stringify({
      token: driver.qrToken,
      username: driver.username,
      password: driver.password
    }));
    setSelectedDriverCredentials({
      username: driver.username,
      password: driver.password
    });
  };

  const handleCloseQrDialog = () => {
    setCurrentQrCode(null);
    setSelectedDriverCredentials(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Drivers</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search drivers..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">License</Label>
                  <Input 
                    id="license" 
                    value={newDriver.license}
                    onChange={(e) => setNewDriver({...newDriver, license: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="busNumber">Bus Number</Label>
                  <Input 
                    id="busNumber" 
                    value={newDriver.busNumber}
                    onChange={(e) => setNewDriver({...newDriver, busNumber: e.target.value})}
                  />
                </div>
                <Button onClick={handleAddDriver} className="w-full">
                  Add Driver
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>License</TableHead>
            <TableHead>Bus Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDrivers.map((driver) => (
            <TableRow key={driver.id}>
              <TableCell>{driver.name}</TableCell>
              <TableCell>{driver.phone}</TableCell>
              <TableCell>{driver.license}</TableCell>
              <TableCell>{driver.busNumber}</TableCell>
              <TableCell>{driver.status}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => viewDriverQrCode(driver)}
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteDriver(driver.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* QR Code Dialog */}
      {currentQrCode && (
        <Dialog open={!!currentQrCode} onOpenChange={handleCloseQrDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Driver Login QR Code</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              <div className="border rounded-lg p-4 bg-white">
                <QRCodeSVG value={currentQrCode} size={240} />
              </div>
              
              {selectedDriverCredentials && (
                <div className="w-full border rounded p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Username:</span>
                    <span>{selectedDriverCredentials.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Password:</span>
                    <span>{selectedDriverCredentials.password}</span>
                  </div>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground text-center">
                Driver can log in using the QR code or username/password credentials
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminDrivers;
