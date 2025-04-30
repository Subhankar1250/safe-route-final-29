
import React, { useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon } from 'ol/style';
import 'ol/ol.css';

interface LiveBusLocationProps {
  latitude: number;
  longitude: number;
  busNumber: string;
}

const LiveBusLocation: React.FC<LiveBusLocationProps> = ({ latitude, longitude, busNumber }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  
  useEffect(() => {
    if (!mapRef.current) return;

    // Create map if it doesn't exist
    if (!mapInstanceRef.current) {
      const busLocation = fromLonLat([longitude, latitude]);
      
      // Create a feature with a bus icon
      const busFeature = new Feature({
        geometry: new Point(busLocation)
      });
      
      // Style the feature with a bus icon
      busFeature.setStyle(
        new Style({
          image: new Icon({
            src: '/bus-icon.svg',
            scale: 1.5,
            anchor: [0.5, 0.5]
          })
        })
      );
      
      // Create a vector source and layer for the bus
      const vectorSource = new VectorSource({
        features: [busFeature]
      });
      
      const vectorLayer = new VectorLayer({
        source: vectorSource
      });
      
      // Create the map
      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          vectorLayer
        ],
        view: new View({
          center: busLocation,
          zoom: 15
        })
      });
      
      mapInstanceRef.current = map;
    } else {
      // Update bus position
      const busLocation = fromLonLat([longitude, latitude]);
      const view = mapInstanceRef.current.getView();
      view.setCenter(busLocation);
      
      // Update bus feature
      const layers = mapInstanceRef.current.getLayers().getArray();
      const vectorLayer = layers[1] as VectorLayer<VectorSource>;
      const source = vectorLayer.getSource();
      const features = source?.getFeatures();
      
      if (features && features.length > 0) {
        const busFeature = features[0];
        busFeature.setGeometry(new Point(busLocation));
      }
    }
  }, [latitude, longitude]);
  
  return (
    <div ref={mapRef} className="w-full h-full"></div>
  );
};

export default LiveBusLocation;
