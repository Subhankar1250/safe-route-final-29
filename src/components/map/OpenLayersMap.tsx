
import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { BusMarkerProps, createBusMarker } from './BusMarker';
import { MAP_CONFIG } from './mapConfig';

interface OpenLayersMapProps {
  busLocations: BusMarkerProps[];
  selectedBusId?: string;
  className?: string;
}

const OpenLayersMap: React.FC<OpenLayersMapProps> = ({ 
  busLocations, 
  selectedBusId,
  className = "absolute inset-0"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObject = useRef<Map | null>(null);
  const markersRef = useRef<{ [key: string]: Feature }>({});
  const vectorSourceRef = useRef<VectorSource | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

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
          // Base OSM layer with proper attribution
          new TileLayer({
            source: new OSM({
              attributions: MAP_CONFIG.attribution
            })
          }),
          // Vector layer for markers
          vectorLayer
        ],
        view: new View({
          center: fromLonLat(MAP_CONFIG.defaultCenter), 
          zoom: MAP_CONFIG.defaultZoom,
          minZoom: MAP_CONFIG.minZoom,
          maxZoom: MAP_CONFIG.maxZoom
        })
      });

      setMapLoaded(true);
      console.log('Map initialization successful');
      
    } catch (err) {
      console.error('Error initializing map:', err);
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
      const feature = createBusMarker(bus);
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
          duration: MAP_CONFIG.animationDuration
        });
      } else {
        // Calculate extent to fit all buses
        vectorSourceRef.current?.getExtent() && 
        mapObject.current.getView().fit(vectorSourceRef.current.getExtent(), {
          padding: [50, 50, 50, 50],
          maxZoom: 15,
          duration: MAP_CONFIG.animationDuration
        });
      }
    }
  }, [busLocations, mapLoaded, selectedBusId]);

  // Reset map view
  const resetView = () => {
    if (!mapObject.current) return;
    
    mapObject.current.getView().animate({
      center: fromLonLat(MAP_CONFIG.defaultCenter),
      zoom: MAP_CONFIG.defaultZoom,
      duration: MAP_CONFIG.animationDuration
    });
  };

  return (
    <div ref={mapRef} className={className} />
  );
};

export default OpenLayersMap;
