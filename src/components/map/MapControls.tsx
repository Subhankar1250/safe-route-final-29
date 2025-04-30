
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { CardTitle } from '@/components/ui/card';

interface MapControlsProps {
  routes: { id: string; name: string }[];
  selectedRoute: string;
  onRouteChange: (value: string) => void;
  onResetView: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ 
  routes, 
  selectedRoute, 
  onRouteChange, 
  onResetView 
}) => {
  return (
    <div className="flex justify-between items-center">
      <CardTitle>Live Bus Tracking</CardTitle>
      <div className="flex items-center space-x-2">
        <Select 
          value={selectedRoute} 
          onValueChange={onRouteChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All routes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All routes</SelectItem>
            {routes.map(route => (
              <SelectItem key={route.id} value={route.id}>
                {route.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={onResetView}>
          Reset View
        </Button>
      </div>
    </div>
  );
};

export default MapControls;
