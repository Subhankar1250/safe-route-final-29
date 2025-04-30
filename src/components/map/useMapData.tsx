
import { useState, useEffect, useCallback } from 'react';
import { BusMarkerProps } from './BusMarker';
import { MAP_CONFIG } from './mapConfig';

export const useMapData = () => {
  const [busLocations, setBusLocations] = useState<BusMarkerProps[]>([]);
  const [routes, setRoutes] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize map data - in a production app, this would fetch from Supabase
  useEffect(() => {
    const fetchMapData = async () => {
      setIsLoading(true);
      try {
        // In a production app with Supabase integration, you would use:
        // const { data: routesData, error: routesError } = await supabase.from('routes').select('*');
        // const { data: busData, error: busError } = await supabase.from('bus_locations').select('*');
        
        // Mock routes data - replace with actual API call
        const mockRoutes = [
          { id: '1', name: 'North Route' },
          { id: '2', name: 'South Route' },
        ];
        setRoutes(mockRoutes);

        // Mock bus locations data - replace with actual API call
        const mockBusLocations: BusMarkerProps[] = [
          {
            id: '1',
            busNumber: 'BUS001',
            driverName: 'John Doe',
            position: {
              longitude: -122.4194,
              latitude: 37.7749
            },
            speed: 25,
            timestamp: new Date()
          },
          {
            id: '2',
            busNumber: 'BUS002',
            driverName: 'Jane Smith',
            position: {
              longitude: -122.4312,
              latitude: 37.7739
            },
            speed: 15,
            timestamp: new Date()
          }
        ];
        setBusLocations(mockBusLocations);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching map data:', err);
        setError('Failed to load map data. Please try again.');
        setIsLoading(false);
      }
    };

    fetchMapData();
  }, []);

  // Function to simulate bus movement (for demo purposes)
  // In production, this would be replaced with real-time updates from Supabase
  const simulateBusMovement = useCallback(() => {
    setBusLocations(prev => prev.map(bus => ({
      ...bus,
      position: {
        longitude: bus.position.longitude + (Math.random() * 0.001 - 0.0005),
        latitude: bus.position.latitude + (Math.random() * 0.001 - 0.0005)
      },
      speed: Math.floor(Math.random() * 30) + 5,
      timestamp: new Date()
    })));
  }, []);

  return {
    busLocations,
    routes,
    error,
    isLoading,
    simulateBusMovement
  };
};
