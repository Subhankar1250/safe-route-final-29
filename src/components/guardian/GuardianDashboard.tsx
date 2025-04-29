
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, BellRing, School, Home } from "lucide-react";
import LiveMap from '@/components/map/LiveMap';
import { useToast } from '@/components/ui/use-toast';

// Simulated child data
const childrenData = [
  { 
    id: 1, 
    name: "Rahul",
    busNumber: "ST-123",
    driverName: "Amit Kumar",
    status: "in-transit", // in-transit, arrived-school, arrived-home
    estimatedArrival: "8:45 AM",
    currentLocation: "Rajpur Road, near Gandhi Park"
  },
  { 
    id: 2, 
    name: "Priya",
    busNumber: "ST-456",
    driverName: "Rajesh Singh",
    status: "arrived-school",
    estimatedArrival: "Already arrived",
    currentLocation: "School Campus"
  }
];

const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = () => {
    switch(status) {
      case 'in-transit': return 'bg-sishu-accent';
      case 'arrived-school': return 'bg-sishu-secondary';
      case 'arrived-home': return 'bg-sishu-primary';
      default: return 'bg-gray-400';
    }
  };
  
  const getStatusText = () => {
    switch(status) {
      case 'in-transit': return 'In Transit';
      case 'arrived-school': return 'At School';
      case 'arrived-home': return 'At Home';
      default: return 'Unknown';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`${getStatusColor()} h-3 w-3 rounded-full animate-pulse-slow`}></span>
      <span className="text-sm font-medium">{getStatusText()}</span>
    </div>
  );
};

const GuardianDashboard: React.FC = () => {
  const [selectedChildId, setSelectedChildId] = useState(childrenData[0].id);
  const selectedChild = childrenData.find(child => child.id === selectedChildId) || childrenData[0];
  const { toast } = useToast();
  
  const showNotificationDemo = () => {
    toast({
      title: "Bus Update",
      description: `${selectedChild.name}'s bus has left the school. Estimated arrival: 4:15 PM.`,
      duration: 5000,
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-sishu-primary">Guardian Dashboard</h1>
        <p className="text-muted-foreground">Track your child's journey in real-time</p>
      </header>
      
      {childrenData.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Child</label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {childrenData.map(child => (
              <Button
                key={child.id}
                variant={selectedChildId === child.id ? "default" : "outline"}
                onClick={() => setSelectedChildId(child.id)}
                className={selectedChildId === child.id ? "bg-sishu-primary" : ""}
              >
                {child.name}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{selectedChild.name}'s Transport</CardTitle>
              <CardDescription>Bus #{selectedChild.busNumber} • Driver: {selectedChild.driverName}</CardDescription>
            </div>
            <StatusIndicator status={selectedChild.status} />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="bg-sishu-primary/10 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-sishu-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Current Location</p>
                <p className="text-sm text-muted-foreground">{selectedChild.currentLocation}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-sishu-accent/10 p-2 rounded-full">
                <Clock className="h-5 w-5 text-sishu-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">Estimated Arrival</p>
                <p className="text-sm text-muted-foreground">{selectedChild.estimatedArrival}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="h-[400px] mb-6 rounded-xl overflow-hidden border">
        <LiveMap childId={selectedChild.id} />
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Journey Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="morning">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="morning" className="flex items-center gap-2">
                <Home size={16} /> Morning Trip
              </TabsTrigger>
              <TabsTrigger value="afternoon" className="flex items-center gap-2">
                <School size={16} /> Afternoon Trip
              </TabsTrigger>
            </TabsList>
            <TabsContent value="morning">
              <div className="space-y-4">
                <div className="border-l-2 border-sishu-secondary pl-4 py-2">
                  <p className="text-sm font-medium">Pick-up Time</p>
                  <p className="text-sm text-muted-foreground">8:15 AM</p>
                </div>
                <div className="border-l-2 border-sishu-secondary pl-4 py-2">
                  <p className="text-sm font-medium">Estimated School Arrival</p>
                  <p className="text-sm text-muted-foreground">8:45 AM</p>
                </div>
                <div className="border-l-2 border-sishu-secondary pl-4 py-2">
                  <p className="text-sm font-medium">Total Distance</p>
                  <p className="text-sm text-muted-foreground">4.2 km</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="afternoon">
              <div className="space-y-4">
                <div className="border-l-2 border-sishu-primary pl-4 py-2">
                  <p className="text-sm font-medium">School Departure</p>
                  <p className="text-sm text-muted-foreground">4:00 PM</p>
                </div>
                <div className="border-l-2 border-sishu-primary pl-4 py-2">
                  <p className="text-sm font-medium">Estimated Home Arrival</p>
                  <p className="text-sm text-muted-foreground">4:30 PM</p>
                </div>
                <div className="border-l-2 border-sishu-primary pl-4 py-2">
                  <p className="text-sm font-medium">Total Distance</p>
                  <p className="text-sm text-muted-foreground">4.2 km</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2" 
            onClick={showNotificationDemo}
          >
            <BellRing size={16} />
            Show Notification Demo
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GuardianDashboard;
