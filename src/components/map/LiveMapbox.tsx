
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Set your Mapbox access token here
// For production, this should be stored in Supabase secrets
mapboxgl.accessToken = 'pk.your_mapbox_public_token_here';

interface BusLocation {
  id: string;
  busNumber: string;
  driverName: string;
  position: {
    latitude: number;
    longitude: number;
  };
  speed: number;
  heading: number;
  timestamp: Date;
}

interface RoutePoint {
  id: string;
  name: string;
  type: 'stop' | 'start' | 'end';
  position: {
    latitude: number;
    longitude: number;
  };
}

const LiveMapbox: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [busLocations, setBusLocations] = useState<BusLocation[]>([]);
  const [routes, setRoutes] = useState<{ id: string; name: string }[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  // Mock bus location data (in a real app, this would come from a real-time database)
  useEffect(() => {
    // Mock routes data
    const mockRoutes = [
      { id: '1', name: 'North Route' },
      { id: '2', name: 'South Route' },
    ];
    setRoutes(mockRoutes);

    // Mock bus locations data (in a real app, this would come from the Supabase real-time subscription)
    const mockBusLocations: BusLocation[] = [
      {
        id: '1',
        busNumber: 'BUS001',
        driverName: 'John Doe',
        position: {
          latitude: 37.7749,
          longitude: -122.4194
        },
        speed: 25,
        heading: 90,
        timestamp: new Date()
      },
      {
        id: '2',
        busNumber: 'BUS002',
        driverName: 'Jane Smith',
        position: {
          latitude: 37.7739,
          longitude: -122.4312
        },
        speed: 15,
        heading: 180,
        timestamp: new Date()
      }
    ];
    setBusLocations(mockBusLocations);

    // In a real app, you would set up a Supabase real-time subscription here
  }, []);

  // Initialize the map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-122.4194, 37.7749], // Default center (San Francisco)
        zoom: 12
      });

      map.current.addControl(new mapboxgl.NavigationControl());

      map.current.on('load', () => {
        setMapLoaded(true);
      });
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize the map. Please check your Mapbox API key.');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update bus markers when locations change or map loads
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add bus markers
    busLocations.forEach(bus => {
      // Create a bus marker element
      const el = document.createElement('div');
      el.className = 'bus-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.backgroundImage = 'url(/bus-icon.png)'; // You'll need to add this icon to your public folder
      el.style.backgroundSize = '100%';
      
      // Add popup with bus info
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<div class="text-sm">
          <strong>${bus.busNumber}</strong><br>
          Driver: ${bus.driverName}<br>
          Speed: ${bus.speed} km/h<br>
          Last update: ${new Date(bus.timestamp).toLocaleTimeString()}
        </div>`
      );

      // Create and store the marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([bus.position.longitude, bus.position.latitude])
        .setPopup(popup)
        .addTo(map.current!);
        
      markersRef.current[bus.id] = marker;
    });

    // If we have bus locations, fit the map to show all buses
    if (busLocations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      busLocations.forEach(bus => {
        bounds.extend([bus.position.longitude, bus.position.latitude]);
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [busLocations, mapLoaded]);

  // Function to simulate bus movement (for demo purposes)
  const simulateBusMovement = () => {
    setBusLocations(prev => prev.map(bus => ({
      ...bus,
      position: {
        latitude: bus.position.latitude + (Math.random() * 0.001 - 0.0005),
        longitude: bus.position.longitude + (Math.random() * 0.001 - 0.0005)
      },
      timestamp: new Date()
    })));
  };

  // In a real app, you would set up a timer or websocket to update bus positions regularly
  useEffect(() => {
    const interval = setInterval(simulateBusMovement, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full h-[calc(100vh-14rem)]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Live Bus Tracking</CardTitle>
          <div className="flex items-center space-x-2">
            <Select 
              value={selectedRoute} 
              onValueChange={setSelectedRoute}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All routes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All routes</SelectItem>
                {routes.map(route => (
                  <SelectItem key={route.id} value={route.id}>
                    {route.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => map.current?.resize()}>
              Reset View
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="relative w-full h-full">
            <div ref={mapContainer} className="absolute inset-0" />
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-md shadow-md text-sm">
              <h3 className="font-bold mb-1">Active Buses</h3>
              <ul className="space-y-1">
                {busLocations.map(bus => (
                  <li key={bus.id} className="flex items-center">
                    <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                    {bus.busNumber} - {bus.driverName}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveMapbox;
