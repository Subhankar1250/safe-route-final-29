import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Plus, Edit, Trash, Search, Map } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Route {
  id: string;
  name: string;
  description: string;
  startPoint: string;
  endPoint: string;
  assignedDriverId?: string;
  assignedBusNumber?: string;
  stops: string[];
}

interface Driver {
  id: string;
  name: string;
  busNumber: string;
}

const AdminRoutes: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newRoute, setNewRoute] = useState<Omit<Route, 'id'>>({
    name: '',
    description: '',
    startPoint: '',
    endPoint: '',
    assignedDriverId: '',
    assignedBusNumber: '',
    stops: []
  });
  const [stopInput, setStopInput] = useState('');
  
  const { toast } = useToast();

  // Mock data loading - in a real app, would fetch from Supabase
  useEffect(() => {
    // Mock routes data
    const mockRoutes = [
      { id: '1', name: 'North Route', description: 'Northern residential areas to school', startPoint: 'Greenwood Park', endPoint: 'Main School Campus', assignedDriverId: '1', assignedBusNumber: 'BUS001', stops: ['Oak Street', 'Pine Avenue', 'Maple Boulevard'] },
      { id: '2', name: 'South Route', description: 'Southern residential areas to school', startPoint: 'Riverside Park', endPoint: 'Main School Campus', assignedDriverId: '2', assignedBusNumber: 'BUS002', stops: ['Elm Street', 'Cedar Road', 'Birch Lane'] },
    ];
    setRoutes(mockRoutes);

    // Mock driver data
    const mockDrivers = [
      { id: '1', name: 'John Doe', busNumber: 'BUS001' },
      { id: '2', name: 'Jane Smith', busNumber: 'BUS002' },
      { id: '3', name: 'Mike Johnson', busNumber: 'BUS003' },
    ];
    setDrivers(mockDrivers);
  }, []);

  const filteredRoutes = routes.filter(route => 
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    route.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRoute = () => {
    // Here would be the actual Supabase implementation
    const id = Math.random().toString(36).substr(2, 9);
    const route = { ...newRoute, id };
    setRoutes([...routes, route as Route]);
    
    // Reset the form
    setNewRoute({
      name: '',
      description: '',
      startPoint: '',
      endPoint: '',
      assignedDriverId: '',
      assignedBusNumber: '',
      stops: []
    });
    setStopInput('');
    
    toast({
      title: 'Success',
      description: 'New route added successfully',
    });
  };

  const handleDeleteRoute = (id: string) => {
    // Here would be the actual Supabase implementation
    setRoutes(routes.filter(route => route.id !== id));
    toast({
      title: 'Success',
      description: 'Route deleted successfully',
    });
  };
  
  const handleDriverChange = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (driver) {
      setNewRoute({
        ...newRoute,
        assignedDriverId: driverId,
        assignedBusNumber: driver.busNumber
      });
    }
  };
  
  const handleAddStop = () => {
    if (stopInput.trim() !== '') {
      setNewRoute({
        ...newRoute,
        stops: [...newRoute.stops, stopInput.trim()]
      });
      setStopInput('');
    }
  };
  
  const handleRemoveStop = (index: number) => {
    const updatedStops = [...newRoute.stops];
    updatedStops.splice(index, 1);
    setNewRoute({
      ...newRoute,
      stops: updatedStops
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Routes</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search routes..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Transport Route</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Route Name</Label>
                  <Input 
                    id="name" 
                    value={newRoute.name}
                    onChange={(e) => setNewRoute({...newRoute, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    value={newRoute.description}
                    onChange={(e) => setNewRoute({...newRoute, description: e.target.value})}
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startPoint">Start Point</Label>
                    <Input 
                      id="startPoint" 
                      value={newRoute.startPoint}
                      onChange={(e) => setNewRoute({...newRoute, startPoint: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endPoint">End Point</Label>
                    <Input 
                      id="endPoint" 
                      value={newRoute.endPoint}
                      onChange={(e) => setNewRoute({...newRoute, endPoint: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="driver">Assign Driver & Vehicle</Label>
                  <Select 
                    value={newRoute.assignedDriverId}
                    onValueChange={handleDriverChange}
                  >
                    <SelectTrigger id="driver">
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map(driver => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name} - {driver.busNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Route Stops</Label>
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Add stop location"
                      value={stopInput}
                      onChange={(e) => setStopInput(e.target.value)}
                    />
                    <Button type="button" onClick={handleAddStop}>Add</Button>
                  </div>
                  
                  {newRoute.stops.length > 0 && (
                    <ul className="mt-2 space-y-1 border rounded-md p-2 bg-muted/30">
                      {newRoute.stops.map((stop, index) => (
                        <li key={index} className="flex items-center justify-between text-sm">
                          <span>{index + 1}. {stop}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveStop(index)}
                            className="h-6 w-6 p-0"
                          >
                            &times;
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <Button onClick={handleAddRoute} className="w-full">
                  Add Route
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
            <TableHead>Description</TableHead>
            <TableHead>Start & End Points</TableHead>
            <TableHead>Assigned Driver</TableHead>
            <TableHead>Assigned Bus</TableHead>
            <TableHead>Stops Count</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRoutes.map((route) => (
            <TableRow key={route.id}>
              <TableCell className="font-medium">{route.name}</TableCell>
              <TableCell>{route.description}</TableCell>
              <TableCell>
                <div className="text-xs">
                  <p>From: {route.startPoint}</p>
                  <p>To: {route.endPoint}</p>
                </div>
              </TableCell>
              <TableCell>
                {drivers.find(d => d.id === route.assignedDriverId)?.name || 'Not assigned'}
              </TableCell>
              <TableCell>{route.assignedBusNumber || 'Not assigned'}</TableCell>
              <TableCell>{route.stops.length} stops</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon">
                    <Map className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteRoute(route.id)}
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

export default AdminRoutes;
