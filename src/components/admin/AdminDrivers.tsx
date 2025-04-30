import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { useFirebase } from '@/contexts/FirebaseContext';
import { Plus, Edit, Trash, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { generateCredentials } from '@/utils/authUtils';

interface Driver {
  id: string;
  name: string;
  phone: string;
  license: string;
  busNumber: string;
  status: "active" | "inactive"; // Fixed status type
  username?: string;
  password?: string;
}

const mockDrivers: Driver[] = [
  { id: '1', name: 'John Doe', phone: '555-1234', license: 'DL12345', busNumber: 'BUS001', status: "active" },
  { id: '2', name: 'Jane Smith', phone: '555-5678', license: 'DL67890', busNumber: 'BUS002', status: "active" },
  { id: '3', name: 'Bob Johnson', phone: '555-9012', license: 'DL45678', busNumber: 'BUS003', status: "inactive" },
];

const AdminDrivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [searchTerm, setSearchTerm] = useState('');
  const [newDriver, setNewDriver] = useState<Omit<Driver, 'id'>>({
    name: '',
    phone: '',
    license: '',
    busNumber: '',
    status: 'active', // Fixed to use the correct type
  });

  const { firestore } = useFirebase();
  const { toast } = useToast();

  // Filter drivers based on search term
  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    driver.phone.includes(searchTerm) ||
    driver.busNumber.includes(searchTerm)
  );
  
  // Add new driver with auto-generated credentials
  const handleAddDriver = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const credentials = generateCredentials(newDriver.name, 'driver');
    
    // Create a new driver with the correct type
    const driver: Driver = {
      ...newDriver,
      id,
      username: credentials.username,
      password: credentials.password,
    };
    
    setDrivers([...drivers, driver]);
    
    toast({
      title: 'Success',
      description: 'New driver added successfully',
    });
  };

  const handleDeleteDriver = (id: string) => {
    setDrivers(drivers.filter(driver => driver.id !== id));
    toast({
      title: 'Success',
      description: 'Driver deleted successfully',
    });
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
