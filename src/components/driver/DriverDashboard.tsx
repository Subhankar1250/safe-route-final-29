
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Clock, Route, User, Users } from "lucide-react";

const DriverDashboard: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [tripStartTime, setTripStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState('00:00:00');
  const { toast } = useToast();

  // Simulated trip data
  const tripData = {
    route: "Route #12B - Dehradun Public School",
    students: 18,
    stops: 7,
    estimatedDuration: "45 minutes",
    nextStop: "Rajpur Road, Gandhi Park",
    etaNextStop: "5 minutes"
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (isActive && tripStartTime) {
      timer = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - tripStartTime.getTime()) / 1000);
        
        const hours = Math.floor(diff / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const seconds = Math.floor(diff % 60).toString().padStart(2, '0');
        
        setElapsed(`${hours}:${minutes}:${seconds}`);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, tripStartTime]);

  const handleStartTrip = () => {
    setIsActive(true);
    setTripStartTime(new Date());
    
    toast({
      title: "Trip Started",
      description: "Location tracking is now active.",
      duration: 3000,
    });
    
    // Simulate periodic location updates
    const mockLocationUpdate = () => {
      console.log("Sending location update...");
      // Here we would send the location to Firebase
    };
    
    // Set up periodic updates every 10 seconds
    setInterval(mockLocationUpdate, 10000);
  };

  const handleEndTrip = () => {
    setIsActive(false);
    
    toast({
      title: "Trip Ended",
      description: "Location tracking has been stopped.",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-sishu-primary">Driver Dashboard</h1>
        <p className="text-muted-foreground">Manage your school transport route</p>
      </header>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>{tripData.route}</CardTitle>
            {isActive && (
              <div className="bg-sishu-accent/10 px-3 py-1 rounded-full flex items-center gap-2">
                <span className="h-2 w-2 bg-sishu-accent rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-sishu-accent">Trip Active</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-sishu-primary/10 p-2 rounded-full">
                <Users className="h-5 w-5 text-sishu-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Students</p>
                <p className="text-sm text-muted-foreground">{tripData.students} assigned</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-sishu-secondary/10 p-2 rounded-full">
                <Route className="h-5 w-5 text-sishu-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium">Stops</p>
                <p className="text-sm text-muted-foreground">{tripData.stops} stops</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isActive ? (
        <Card className="mb-6 border-sishu-secondary border-2">
          <CardHeader className="pb-2 bg-sishu-secondary/5">
            <CardTitle className="flex items-center justify-between">
              <span>Trip in Progress</span>
              <span className="text-sishu-secondary">{elapsed}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-sishu-accent/10 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-sishu-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">Next Stop</p>
                  <p className="text-sm text-muted-foreground">{tripData.nextStop}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-sishu-primary/10 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-sishu-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">ETA</p>
                  <p className="text-sm text-muted-foreground">{tripData.etaNextStop}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-sishu-danger hover:bg-red-500" 
              onClick={handleEndTrip}
            >
              End Trip
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Start a New Trip</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Start your trip to begin real-time location tracking. Your route information will be 
              shared with guardians of assigned students.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-sishu-primary/10 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-sishu-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Estimated Duration</p>
                  <p className="text-sm text-muted-foreground">{tripData.estimatedDuration}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-sishu-secondary hover:bg-green-600" 
              onClick={handleStartTrip}
            >
              Start Trip
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Driver Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="bg-gray-200 dark:bg-gray-700 h-16 w-16 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="font-medium">Rahul Singh</h3>
              <p className="text-sm text-muted-foreground">ID: DRV-2023-142</p>
              <p className="text-sm text-muted-foreground">Vehicle: ST-123</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View Profile</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DriverDashboard;
