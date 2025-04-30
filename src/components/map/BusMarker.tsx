
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { MAP_CONFIG } from './mapConfig';

export interface BusMarkerProps {
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

export const createBusMarker = (bus: BusMarkerProps): Feature => {
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
      src: MAP_CONFIG.busIconPath,
      scale: MAP_CONFIG.busMarkerScale,
      anchor: [0.5, 0.5]
    })
  }));

  return feature;
};
