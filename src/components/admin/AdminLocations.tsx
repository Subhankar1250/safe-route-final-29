
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LiveMapbox from '@/components/map/LiveMapbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

// Sample bus data
const buses = [
  { id: 'BUS001', driver: 'John Doe' },
  { id: 'BUS002', driver: 'Jane Smith' }
];

const AdminLocations: React.FC = () => {
  const [selectedBus, setSelectedBus] = useState<string | undefined>(undefined);
  
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Live Bus Locations</h2>
        <p className="text-muted-foreground">Track school buses in real-time on the map</p>
      </div>
      
      <div className="flex items-end space-x-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="bus-filter">Filter by Bus</Label>
          <Select 
            value={selectedBus} 
            onValueChange={setSelectedBus}
          >
            <SelectTrigger id="bus-filter" className="w-[200px]">
              <SelectValue placeholder="All buses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All buses</SelectItem>
              {buses.map(bus => (
                <SelectItem key={bus.id} value={bus.id}>{bus.id} - {bus.driver}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="map" className="w-full">
        <TabsList>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="pt-4">
          <LiveMapbox busFilter={selectedBus} />
        </TabsContent>
        
        <TabsContent value="list" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* These would be replaced with real-time data from Supabase in a production app */}
            {(!selectedBus || selectedBus === 'all' || selectedBus === 'BUS001') && (
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
            )}
            
            {(!selectedBus || selectedBus === 'all' || selectedBus === 'BUS002') && (
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
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminLocations;
