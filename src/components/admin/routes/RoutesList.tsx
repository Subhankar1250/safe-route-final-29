
import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Map } from 'lucide-react';
import { Route } from './types';

interface RoutesListProps {
  routes: Route[];
  drivers: { id: string; name: string; }[];
  onDelete: (id: string) => void;
}

const RoutesList: React.FC<RoutesListProps> = ({ routes, drivers, onDelete }) => {
  return (
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
        {routes.map((route) => (
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
                  onClick={() => onDelete(route.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RoutesList;
