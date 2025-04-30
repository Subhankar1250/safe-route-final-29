
import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import OpenLayersMap from './OpenLayersMap';
import MapControls from './MapControls';
import BusInfoPanel from './BusInfoPanel';
import { useMapData } from './useMapData';
import { MAP_CONFIG } from './mapConfig';
import './map.css';

interface LiveOpenLayersMapProps {
  selectedBusId?: string;
}

const LiveOpenLayersMap: React.FC<LiveOpenLayersMapProps> = ({ selectedBusId }) => {
  const { busLocations, routes, error, isLoading, simulateBusMovement } = useMapData();
  const [selectedRoute, setSelectedRoute] = useState<string>("all");

  // In a real app, you would set up a real-time subscription with Supabase
  useEffect(() => {
    const interval = setInterval(simulateBusMovement, MAP_CONFIG.locationRefreshInterval);
    return () => clearInterval(interval);
  }, [simulateBusMovement]);

  // Reset map view handler
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
        ) : isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="space-y-2 w-3/4">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-[calc(100vh-18rem)] w-full rounded-md" />
            </div>
          </div>
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
