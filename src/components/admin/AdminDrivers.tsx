
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { useFirebase } from '@/contexts/FirebaseContext';
import { Plus, Edit, Trash, Search, Key, QrCode } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { generateCredentials } from '@/utils/authUtils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

interface Driver {
  id: string;
  name: string;
  phone: string;
  license: string;
  busNumber: string;
  status: 'active' | 'inactive';
  username?: string;
  password?: string;
}

const AdminDrivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCredentials, setShowCredentials] = useState<{[key: string]: boolean}>({});
  const [newDriver, setNewDriver] = useState<Omit<Driver, 'id'>>({
    name: '',
    phone: '',
    license: '',
    busNumber: '',
    status: 'active'
  });
  
  const { firestore } = useFirebase();
  const { toast } = useToast();

  // Mock data loading - in a real app, would fetch from Supabase
  useEffect(() => {
    const mockDrivers = [
      { id: '1', name: 'John Doe', phone: '555-1234', license: 'DL123456', busNumber: 'BUS001', status: 'active', username: 'john.doe', password: '********' },
      { id: '2', name: 'Jane Smith', phone: '555-5678', license: 'DL789123', busNumber: 'BUS002', status: 'active', username: 'jane.smith', password: '********' },
      { id: '3', name: 'Mike Johnson', phone: '555-9012', license: 'DL456789', busNumber: 'BUS003', status: 'inactive', username: 'mike.johnson', password: '********' },
    ];
    setDrivers(mockDrivers);
  }, []);

  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    driver.busNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDriver = () => {
    // Generate credentials
    const credentials = generateCredentials(newDriver.name, 'driver');
    
    // Here would be the actual Supabase implementation to:
    // 1. Create user account with the generated credentials
    // 2. Store the driver details
    
    const id = Math.random().toString(36).substr(2, 9);
    
    // Create the new driver record with credentials
    const driver = { 
      ...newDriver, 
      id,
      username: credentials.username,
      password: credentials.password
    };
    
    setDrivers([...drivers, driver as Driver]);
    
    // Reset the form
    setNewDriver({
      name: '',
      phone: '',
      license: '',
      busNumber: '',
      status: 'active'
    });
    
    toast({
      title: 'Success',
      description: 'New driver added successfully with auto-generated credentials',
    });
  };

  const handleDeleteDriver = (id: string) => {
    // Here would be the actual Supabase implementation
    setDrivers(drivers.filter(driver => driver.id !== id));
    toast({
      title: 'Success',
      description: 'Driver deleted successfully',
    });
  };

  const toggleShowCredentials = (id: string) => {
    setShowCredentials(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">Driver's License</Label>
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
                <p className="text-xs text-muted-foreground text-center">
                  A unique username and password will be automatically generated
                </p>
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
            <TableHead>Credentials</TableHead>
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
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  driver.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {driver.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => toggleShowCredentials(driver.id)}
                  >
                    <Key className="h-3.5 w-3.5" />
                    {showCredentials[driver.id] ? 'Hide' : 'Show'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    QR Code
                  </Button>
                </div>
                {showCredentials[driver.id] && (
                  <div className="mt-1 text-xs">
                    <p>Username: {driver.username}</p>
                    <p>Password: {driver.password}</p>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
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
    </div>
  );
};

export default AdminDrivers;
