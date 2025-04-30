
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LiveOpenLayersMap from '@/components/map/LiveOpenLayersMap';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';

// Sample bus data - in a real app, this would come from your database
const buses = [
  { id: 'BUS001', driver: 'John Doe', route: 'North Route' },
  { id: 'BUS002', driver: 'Jane Smith', route: 'South Route' },
  { id: 'BUS003', driver: 'Bob Johnson', route: 'East Route' }
];

// Sample route data - in a real app, this would come from your database
const routes = [
  { id: 'ROUTE001', name: 'North Route', description: 'Northern district schools' },
  { id: 'ROUTE002', name: 'South Route', description: 'Southern district schools' },
  { id: 'ROUTE003', name: 'East Route', description: 'Eastern district schools' }
];

const AdminLocations: React.FC = () => {
  const [selectedBus, setSelectedBus] = useState<string>("all");
  const [selectedRoute, setSelectedRoute] = useState<string>("all");
  const { toast } = useToast();
  
  // Filter buses based on selected route
  const filteredBuses = selectedRoute === "all" 
    ? buses 
    : buses.filter(bus => {
        const route = routes.find(r => r.id === selectedRoute);
        return route && bus.route === route.name;
      });

  const handleBusChange = (busId: string) => {
    setSelectedBus(busId);
    
    if (busId !== "all") {
      toast({
        title: "Bus Selected",
        description: `Now tracking ${buses.find(b => b.id === busId)?.driver}'s bus`
      });
    }
  };

  const handleRouteChange = (routeId: string) => {
    setSelectedRoute(routeId);
    setSelectedBus("all"); // Reset bus selection when route changes
    
    if (routeId !== "all") {
      toast({
        title: "Route Selected",
        description: `Viewing buses on ${routes.find(r => r.id === routeId)?.name}`
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Live Bus Locations</h2>
        <p className="text-muted-foreground">Track school buses in real-time on the map</p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="route-filter">Filter by Route</Label>
              <Select 
                value={selectedRoute} 
                onValueChange={handleRouteChange}
              >
                <SelectTrigger id="route-filter">
                  <SelectValue placeholder="All routes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All routes</SelectItem>
                  {routes.map(route => (
                    <SelectItem key={route.id} value={route.id}>{route.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Select a route to view its buses</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bus-filter">Select Specific Bus</Label>
              <Select 
                value={selectedBus} 
                onValueChange={handleBusChange}
              >
                <SelectTrigger id="bus-filter">
                  <SelectValue placeholder="All buses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All buses</SelectItem>
                  {filteredBuses.map(bus => (
                    <SelectItem key={bus.id} value={bus.id}>{bus.id} - {bus.driver}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Focus on a specific bus on the map</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="map" className="w-full">
        <TabsList>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="pt-4">
          <LiveOpenLayersMap selectedBusId={selectedBus} />
        </TabsContent>
        
        <TabsContent value="list" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* These would be replaced with real-time data from Supabase in a production app */}
            {filteredBuses.map(bus => {
              if (selectedBus !== "all" && selectedBus !== bus.id) return null;
              
              return (
                <div key={bus.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{bus.id}</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                  </div>
                  <p className="text-sm text-gray-500">Driver: {bus.driver}</p>
                  <p className="text-sm text-gray-500">Route: {bus.route}</p>
                  <p className="text-sm text-gray-500">
                    Location: {bus.id === 'BUS001' ? '37.7749, -122.4194' : bus.id === 'BUS002' ? '37.7739, -122.4312' : '37.7833, -122.4167'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Speed: {Math.floor(Math.random() * 30) + 5} km/h
                  </p>
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminLocations;
