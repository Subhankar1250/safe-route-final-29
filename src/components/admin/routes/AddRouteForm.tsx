
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Route } from './types';
import { Driver } from './types';

interface AddRouteFormProps {
  drivers: Driver[];
  onAddRoute: (route: Omit<Route, 'id'>) => void;
}

const AddRouteForm: React.FC<AddRouteFormProps> = ({ drivers, onAddRoute }) => {
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

  const handleSubmit = () => {
    onAddRoute(newRoute);
    
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
  };

  return (
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
      
      <Button onClick={handleSubmit} className="w-full">
        Add Route
      </Button>
    </div>
  );
};

export default AddRouteForm;
