
import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import OpenLayersMap from './OpenLayersMap';
import MapControls from './MapControls';
import BusInfoPanel from './BusInfoPanel';
import { useMapData } from './useMapData';
import './map.css';

interface LiveOpenLayersMapProps {
  selectedBusId?: string;
}

const LiveOpenLayersMap: React.FC<LiveOpenLayersMapProps> = ({ selectedBusId }) => {
  const { busLocations, routes, error, simulateBusMovement } = useMapData();
  const [selectedRoute, setSelectedRoute] = useState<string>("all");

  // In a real app, you would set up a timer or websocket to update bus positions regularly
  useEffect(() => {
    const interval = setInterval(simulateBusMovement, 3000);
    return () => clearInterval(interval);
  }, []);

  // Reset map view handler (will be passed to the map component)
  const handleResetView = () => {
    // This function is now handled internally by the OpenLayersMap component
  };

  return (
    <Card className="w-full h-[calc(100vh-14rem)]">
      <CardHeader className="pb-2">
        <MapControls 
          routes={routes}
          selectedRoute={selectedRoute}
          onRouteChange={setSelectedRoute}
          onResetView={handleResetView}
        />
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
            <OpenLayersMap 
              busLocations={busLocations}
              selectedBusId={selectedBusId}
            />
            <BusInfoPanel 
              buses={busLocations}
              selectedBusId={selectedBusId}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveOpenLayersMap;
