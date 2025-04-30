
import { useState, useEffect } from 'react';
import { BusMarkerProps } from './BusMarker';

export const useMapData = () => {
  const [busLocations, setBusLocations] = useState<BusMarkerProps[]>([]);
  const [routes, setRoutes] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize mock data
  useEffect(() => {
    try {
      // Mock routes data
      const mockRoutes = [
        { id: '1', name: 'North Route' },
        { id: '2', name: 'South Route' },
      ];
      setRoutes(mockRoutes);

      // Mock bus locations data
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
    } catch (err) {
      console.error('Error initializing map data:', err);
      setError('Failed to load map data. Please try again.');
    }
  }, []);

  // Function to simulate bus movement (for demo purposes)
  const simulateBusMovement = () => {
    setBusLocations(prev => prev.map(bus => ({
      ...bus,
      position: {
        longitude: bus.position.longitude + (Math.random() * 0.001 - 0.0005),
        latitude: bus.position.latitude + (Math.random() * 0.001 - 0.0005)
      },
      timestamp: new Date()
    })));
  };

  return {
    busLocations,
    routes,
    error,
    simulateBusMovement
  };
};
