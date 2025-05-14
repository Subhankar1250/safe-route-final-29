
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Clock, UserCheck } from "lucide-react";
import LiveOpenLayersMap from "../map/LiveOpenLayersMap";
import StudentCheckList from "./StudentCheckList";
import StudentAttendance from "./StudentAttendance";
import EmergencyAlerts from "./EmergencyAlerts";
import LanguageSelector from "../common/LanguageSelector";
import { useLanguage } from '@/contexts/LanguageContext';
import { registerForPushNotifications } from '@/services/notifications';

const DriverDashboard: React.FC = () => {
  const [user] = useState({ name: 'John Driver', busNumber: 'BUS-001' });
  const [tripActive, setTripActive] = useState(false);
  const [tripStartTime, setTripStartTime] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Request notifications permission
  useEffect(() => {
    registerForPushNotifications().then(success => {
      if (success) {
        console.log('Push notifications registration successful');
      } else {
        console.log('Push notifications not supported or permission denied');
      }
    });
  }, []);

  // Simulate location tracking
  useEffect(() => {
    if (tripActive) {
      const interval = setInterval(() => {
        // Simulate location changes
        setCurrentLocation(prev => {
          if (!prev) return { latitude: 30.3165, longitude: 78.0322 };
          
          return {
            latitude: prev.latitude + (Math.random() * 0.002 - 0.001),
            longitude: prev.longitude + (Math.random() * 0.002 - 0.001)
          };
        });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [tripActive]);

  const startTrip = () => {
    const startTime = new Date().toLocaleTimeString();
    setTripStartTime(startTime);
    setTripActive(true);
    
    // Get current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Use default location if geolocation fails
          setCurrentLocation({ latitude: 30.3165, longitude: 78.0322 });
        }
      );
    } else {
      // Use default location if geolocation not supported
      setCurrentLocation({ latitude: 30.3165, longitude: 78.0322 });
    }
    
    toast({
      title: "Trip Started",
      description: `Trip started at ${startTime}. Safe journey!`,
    });
  };

  const endTrip = () => {
    setTripActive(false);
    toast({
      title: "Trip Ended",
      description: `Trip ended at ${new Date().toLocaleTimeString()}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-sishu-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/5660de73-133f-4d61-aa57-08b2be7b455d.png" 
              alt="Sishu Tirtha Safe Route" 
              className="h-10 w-10" 
            />
            <h1 className="text-xl font-bold">{t('dashboard.welcome')}, {user.name}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Button 
              variant={tripActive ? "destructive" : "outline"} 
              size="sm"
              onClick={tripActive ? endTrip : startTrip}
            >
              {tripActive ? "End Trip" : "Start Trip"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-6">
        {/* Trip Status Card */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('bus.onRoute')}</p>
                  <h3 className="font-medium">Bus {user.busNumber}</h3>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Status</p>
                  <h3 className="font-medium">
                    {tripActive 
                      ? `Active (Started at ${tripStartTime})` 
                      : "Not Active"}
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-2 rounded-full">
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Students</p>
                  <h3 className="font-medium">0/30 on board</h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Maps and Student List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Live Map */}
            <Card className="h-96">
              <CardContent className="p-0 h-full">
                <LiveOpenLayersMap selectedBusId={user.busNumber} />
              </CardContent>
            </Card>
            
            {/* Emergency Alerts */}
            <EmergencyAlerts 
              busNumber={user.busNumber} 
              driverName={user.name} 
              currentLocation={currentLocation || undefined}
            />
          </div>
          
          <div className="space-y-6">
            {/* Student Attendance */}
            <StudentAttendance tripId="current-trip" isActive={tripActive} />
            
            {/* Student Checklist */}
            <StudentCheckList isActive={tripActive} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
