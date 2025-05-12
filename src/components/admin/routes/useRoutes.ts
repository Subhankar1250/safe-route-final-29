
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Route, Driver } from './types';

export const useRoutes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Mock data loading - in a real app, would fetch from Firebase
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

  const handleAddRoute = (newRouteData: Omit<Route, 'id'>) => {
    // Here would be the actual Firebase implementation
    const id = Math.random().toString(36).substr(2, 9);
    const route = { ...newRouteData, id };
    setRoutes([...routes, route as Route]);
    
    toast({
      title: 'Success',
      description: 'New route added successfully',
    });
  };

  const handleDeleteRoute = (id: string) => {
    // Here would be the actual Firebase implementation
    setRoutes(routes.filter(route => route.id !== id));
    toast({
      title: 'Success',
      description: 'Route deleted successfully',
    });
  };

  return {
    routes: filteredRoutes,
    drivers,
    searchTerm,
    setSearchTerm,
    handleAddRoute,
    handleDeleteRoute,
  };
};
