
import React, { useEffect, useRef } from 'react';

interface LiveMapProps {
  childId: number;
}

const LiveMap: React.FC<LiveMapProps> = ({ childId }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // This is a placeholder for actual map implementation
    // In a real app, we'd use a library like Mapbox, Leaflet, or Google Maps

    const mapContainer = mapRef.current;
    
    // Create a simple mock map with CSS
    mapContainer.style.backgroundImage = "url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/78.0322,30.3165,13,0/600x400?access_token=pk.placeholder')";
    mapContainer.style.backgroundSize = "cover";
    mapContainer.style.backgroundPosition = "center";
    
    // Add a vehicle marker
    const vehicleMarker = document.createElement('div');
    vehicleMarker.className = 'absolute w-5 h-5 bg-sishu-primary rounded-full border-2 border-white shadow-md';
    vehicleMarker.style.top = '50%';
    vehicleMarker.style.left = '40%';
    vehicleMarker.style.transform = 'translate(-50%, -50%)';
    mapContainer.appendChild(vehicleMarker);
    
    // Add a pulse effect
    const pulseEffect = document.createElement('div');
    pulseEffect.className = 'absolute w-10 h-10 bg-sishu-primary/30 rounded-full animate-ping';
    pulseEffect.style.top = '50%';
    pulseEffect.style.left = '40%';
    pulseEffect.style.transform = 'translate(-50%, -50%)';
    mapContainer.appendChild(pulseEffect);
    
    // Add home marker
    const homeMarker = document.createElement('div');
    homeMarker.className = 'absolute w-5 h-5 bg-sishu-accent rounded-full border-2 border-white shadow-md';
    homeMarker.style.top = '60%';
    homeMarker.style.left = '20%';
    homeMarker.style.transform = 'translate(-50%, -50%)';
    mapContainer.appendChild(homeMarker);
    
    // Add school marker
    const schoolMarker = document.createElement('div');
    schoolMarker.className = 'absolute w-5 h-5 bg-sishu-secondary rounded-full border-2 border-white shadow-md';
    schoolMarker.style.top = '30%';
    schoolMarker.style.left = '70%';
    schoolMarker.style.transform = 'translate(-50%, -50%)';
    mapContainer.appendChild(schoolMarker);
    
    // Add a path between points
    const path = document.createElement('div');
    path.className = 'absolute h-0.5 bg-sishu-primary rounded-full';
    path.style.top = '55%';
    path.style.left = '30%';
    path.style.width = '30%';
    path.style.transform = 'rotate(-20deg)';
    path.style.transformOrigin = 'left';
    mapContainer.appendChild(path);
    
    // Add labels
    const homeLabel = document.createElement('div');
    homeLabel.className = 'absolute text-xs font-medium bg-white px-1 rounded shadow-sm';
    homeLabel.textContent = 'Home';
    homeLabel.style.top = 'calc(60% + 10px)';
    homeLabel.style.left = '20%';
    homeLabel.style.transform = 'translateX(-50%)';
    mapContainer.appendChild(homeLabel);
    
    const schoolLabel = document.createElement('div');
    schoolLabel.className = 'absolute text-xs font-medium bg-white px-1 rounded shadow-sm';
    schoolLabel.textContent = 'School';
    schoolLabel.style.top = 'calc(30% + 10px)';
    schoolLabel.style.left = '70%';
    schoolLabel.style.transform = 'translateX(-50%)';
    mapContainer.appendChild(schoolLabel);
    
    // Add map attribution
    const attribution = document.createElement('div');
    attribution.className = 'absolute bottom-1 right-1 text-xs text-black/50 bg-white/70 px-1 rounded';
    attribution.textContent = '© Mock Map Data';
    mapContainer.appendChild(attribution);

    // Cleanup function
    return () => {
      mapContainer.innerHTML = '';
    };
  }, [childId]);

  return (
    <div ref={mapRef} className="w-full h-full relative bg-gray-100">
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  );
};

export default LiveMap;
