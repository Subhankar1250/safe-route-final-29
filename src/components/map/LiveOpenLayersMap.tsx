
import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import '../map/map.css';

interface BusLocation {
  id: string;
  busNumber: string;
  driverName: string;
  position: {
    longitude: number;
    latitude: number;
  };
  speed: number;
  timestamp: Date;
}

interface LiveOpenLayersMapProps {
  selectedBusId?: string;
}

const LiveOpenLayersMap: React.FC<LiveOpenLayersMapProps> = ({ selectedBusId }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObject = useRef<Map | null>(null);
  const [busLocations, setBusLocations] = useState<BusLocation[]>([]);
  const [routes, setRoutes] = useState<{ id: string; name: string }[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>("all"); // Changed from empty string to "all"
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<{ [key: string]: Feature }>({});
  const vectorSourceRef = useRef<VectorSource | null>(null);

  // Mock data setup
  useEffect(() => {
    // Mock routes data
    const mockRoutes = [
      { id: '1', name: 'North Route' },
      { id: '2', name: 'South Route' },
    ];
    setRoutes(mockRoutes);

    // Mock bus locations data
    const mockBusLocations: BusLocation[] = [
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
  }, []);

  // Initialize OpenLayers map
  useEffect(() => {
    if (!mapRef.current || mapObject.current) return;

    try {
      // Create vector source for bus markers
      const vectorSource = new VectorSource();
      vectorSourceRef.current = vectorSource;

      // Create vector layer for bus markers
      const vectorLayer = new VectorLayer({
        source: vectorSource
      });

      // Create OpenLayers map
      mapObject.current = new Map({
        target: mapRef.current,
        layers: [
          // Base OSM layer
          new TileLayer({
            source: new OSM()
          }),
          // Vector layer for markers
          vectorLayer
        ],
        view: new View({
          center: fromLonLat([-122.4194, 37.7749]), // San Francisco
          zoom: 12
        })
      });

      setMapLoaded(true);
      
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize the map. Please try again.');
    }

    return () => {
      if (mapObject.current) {
        mapObject.current.setTarget(undefined);
        mapObject.current = null;
      }
    };
  }, []);

  // Update bus markers when locations change or map loads
  useEffect(() => {
    if (!mapLoaded || !vectorSourceRef.current) return;

    // Clear existing features
    vectorSourceRef.current.clear();
    markersRef.current = {};

    // Filter buses based on selected bus
    const filteredBuses = selectedBusId && selectedBusId !== 'all' 
      ? busLocations.filter(bus => bus.busNumber === selectedBusId)
      : busLocations;

    // Add bus markers
    filteredBuses.forEach(bus => {
      // Create a point feature at bus location
      const feature = new Feature({
        geometry: new Point(fromLonLat([bus.position.longitude, bus.position.latitude])),
        name: bus.busNumber,
        busInfo: {
          busNumber: bus.busNumber,
          driverName: bus.driverName,
          speed: bus.speed,
          timestamp: bus.timestamp
        }
      });

      // Style the feature with a bus icon
      feature.setStyle(new Style({
        image: new Icon({
          src: '/bus-icon.svg', // Make sure this exists in public folder
          scale: 0.5,
          anchor: [0.5, 0.5]
        })
      }));

      // Add the feature to the vector source
      vectorSourceRef.current?.addFeature(feature);
      markersRef.current[bus.id] = feature;
    });

    // Fit map view to show all buses if we have locations
    if (filteredBuses.length > 0 && mapObject.current) {
      const view = mapObject.current.getView();
      if (filteredBuses.length === 1) {
        // If only one bus, center on it with closer zoom
        const bus = filteredBuses[0];
        view.animate({
          center: fromLonLat([bus.position.longitude, bus.position.latitude]),
          zoom: 14,
          duration: 1000
        });
      } else {
        // Calculate extent to fit all buses
        vectorSourceRef.current?.getExtent() && 
        mapObject.current.getView().fit(vectorSourceRef.current.getExtent(), {
          padding: [50, 50, 50, 50],
          maxZoom: 15,
          duration: 1000
        });
      }
    }
  }, [busLocations, mapLoaded, selectedBusId]);

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

  // In a real app, you would set up a timer or websocket to update bus positions regularly
  useEffect(() => {
    const interval = setInterval(simulateBusMovement, 3000);
    return () => clearInterval(interval);
  }, []);

  // Reset map view
  const resetView = () => {
    if (!mapObject.current) return;
    
    mapObject.current.getView().animate({
      center: fromLonLat([-122.4194, 37.7749]),
      zoom: 12,
      duration: 1000
    });
  };

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
                <SelectItem value="all">All routes</SelectItem>
                {routes.map(route => (
                  <SelectItem key={route.id} value={route.id}>
                    {route.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={resetView}>
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
            <div ref={mapRef} className="absolute inset-0" />
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-md shadow-md text-sm">
              <h3 className="font-bold mb-1">Active Buses</h3>
              <ul className="space-y-1">
                {busLocations.filter(bus => 
                  !selectedBusId || selectedBusId === 'all' || bus.busNumber === selectedBusId
                ).map(bus => (
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

export default LiveOpenLayersMap;
