
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LiveMapbox from '@/components/map/LiveMapbox';

const AdminLocations: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Live Bus Locations</h2>
        <p className="text-muted-foreground">Track school buses in real-time on the map</p>
      </div>
      
      <Tabs defaultValue="map" className="w-full">
        <TabsList>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="pt-4">
          <LiveMapbox />
        </TabsContent>
        
        <TabsContent value="list" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* These would be replaced with real-time data from Supabase in a production app */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">BUS001</h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
              </div>
              <p className="text-sm text-gray-500">Driver: John Doe</p>
              <p className="text-sm text-gray-500">
                Location: 37.7749, -122.4194
              </p>
              <p className="text-sm text-gray-500">
                Speed: 25 km/h
              </p>
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">BUS002</h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
              </div>
              <p className="text-sm text-gray-500">Driver: Jane Smith</p>
              <p className="text-sm text-gray-500">
                Location: 37.7739, -122.4312
              </p>
              <p className="text-sm text-gray-500">
                Speed: 15 km/h
              </p>
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminLocations;
