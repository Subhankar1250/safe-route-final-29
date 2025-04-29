
import React, { useState } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { Button } from '@/components/ui/button';

const AdminLocations: React.FC = () => {
  const [activeBuses, setActiveBuses] = useState([
    { id: '1', driverName: 'John Doe', busNumber: 'BUS001', location: { lat: 37.7749, lng: -122.4194 }, lastUpdated: new Date() },
    { id: '2', driverName: 'Jane Smith', busNumber: 'BUS002', location: { lat: 37.7739, lng: -122.4312 }, lastUpdated: new Date() },
  ]);

  // In a real application, you would:
  // 1. Subscribe to real-time location updates from Firestore or Firebase Realtime DB
  // 2. Use a mapping library like Google Maps, Mapbox, or Leaflet

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Live Bus Locations</h2>
        <Button>Refresh</Button>
      </div>
      
      <div className="bg-gray-100 border border-gray-200 rounded-lg h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Map Integration Would Go Here</p>
          <p className="text-sm text-gray-500">Integrate with Google Maps, Mapbox, or similar service</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeBuses.map(bus => (
          <div key={bus.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{bus.busNumber}</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
            </div>
            <p className="text-sm text-gray-500">Driver: {bus.driverName}</p>
            <p className="text-sm text-gray-500">
              Location: {bus.location.lat.toFixed(4)}, {bus.location.lng.toFixed(4)}
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {bus.lastUpdated.toLocaleTimeString()}
            </p>
            <Button variant="outline" className="w-full mt-2">View Details</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLocations;
