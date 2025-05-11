
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Clock, Route, User, Users, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StudentCheckList from './StudentCheckList';

const DriverDashboard: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [tripStartTime, setTripStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState('00:00:00');
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const navigate = useNavigate();
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
    
    // Start tracking location
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        position => {
          setLocation(position);
          sendLocationUpdate(position);
        },
        error => {
          console.error('Error getting location:', error);
          toast({
            title: "Location Error",
            description: `Failed to get location: ${error.message}`,
            variant: "destructive",
          });
        },
        { 
          enableHighAccuracy: true, 
          maximumAge: 10000,
          timeout: 5000 
        }
      );
      
      setWatchId(id);
    } else {
      toast({
        title: "Location Not Available",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
    }
    
    toast({
      title: "Trip Started",
      description: "Location tracking is now active.",
      duration: 3000,
    });
  };

  const handleEndTrip = () => {
    setIsActive(false);
    
    // Stop tracking location
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    
    toast({
      title: "Trip Ended",
      description: `Total trip time: ${elapsed}`,
      duration: 3000,
    });
  };

  const sendLocationUpdate = async (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    
    console.log(`Sending location update: ${latitude}, ${longitude}`);
    
    // In a real app, this would send the data to a backend service
    try {
      // Mock implementation - in a real app, we would send this data to the server
      console.log(`Location updated: Lat ${latitude}, Lng ${longitude}`);
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const handleLogout = () => {
    // If tracking is active, stop it
    if (isActive && watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }
    
    // Here would be the actual logout logic
    toast({
      title: "Logging out",
      description: "You have been successfully logged out.",
    });
    
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-sishu-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Sishu Tirtha - Driver Dashboard</h1>
          <Button variant="ghost" onClick={handleLogout} className="text-white">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Trip Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Current Route</p>
                  <p className="font-medium flex items-center">
                    <Route className="mr-2 h-4 w-4" /> {tripData.route}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Total Students</p>
                    <p className="font-medium">{tripData.students}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Stops</p>
                    <p className="font-medium">{tripData.stops}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Next Stop</p>
                  <p className="font-medium">{tripData.nextStop}</p>
                  <p className="text-sm text-sishu-primary">ETA: {tripData.etaNextStop}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Tracking Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    {isActive ? 'Trip in progress' : 'Not started'}
                  </p>
                </div>
                {isActive && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Trip Time</p>
                      <p className="font-medium flex items-center">
                        <Clock className="mr-2 h-4 w-4" /> {elapsed}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">GPS Location</p>
                      <p className="font-medium flex items-center">
                        <MapPin className="mr-2 h-4 w-4" /> 
                        {location ? 
                          `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}` : 
                          'Acquiring...'}
                      </p>
                    </div>
                  </>
                )}
                <div className="pt-2">
                  {!isActive ? (
                    <Button 
                      className="w-full bg-sishu-primary hover:bg-blue-700" 
                      onClick={handleStartTrip}
                    >
                      Start Trip
                    </Button>
                  ) : (
                    <Button 
                      variant="destructive" 
                      className="w-full" 
                      onClick={handleEndTrip}
                    >
                      End Trip
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <StudentCheckList isActive={isActive} />
      </div>
    </div>
  );
};

export default DriverDashboard;
