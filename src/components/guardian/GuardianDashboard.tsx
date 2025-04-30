
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Clock, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LiveBusLocation from './LiveBusLocation';

interface StudentInfo {
  id: string;
  name: string;
  grade: string;
  busNumber: string;
  driverName: string;
  isOnBus: boolean;
  lastCheckIn?: string;
  lastCheckOut?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    lastUpdated: string;
  };
  estimatedArrival?: string;
}

const GuardianDashboard: React.FC = () => {
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simulated data fetch - in a real app would connect to Supabase
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      // Mock student data - in a real app, this would come from Supabase
      // based on the logged-in guardian's account
      const mockStudent: StudentInfo = {
        id: '1',
        name: 'Alice Johnson',
        grade: '3A',
        busNumber: 'BUS001',
        driverName: 'John Doe',
        isOnBus: true,
        lastCheckIn: '07:45 AM',
        currentLocation: {
          latitude: 37.7749,
          longitude: -122.4194,
          lastUpdated: new Date().toLocaleTimeString()
        },
        estimatedArrival: '08:15 AM'
      };
      
      setStudent(mockStudent);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    // Here would be the actual logout logic when integrated with Supabase
    toast({
      title: "Logging out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sishu-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading student information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-sishu-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Sishu Tirtha - Guardian View</h1>
          <Button variant="ghost" onClick={handleLogout} className="text-white">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto p-4">
        {student ? (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <User className="mr-2 h-5 w-5" /> {student.name} - {student.grade}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Bus Number</p>
                    <p className="font-medium">{student.busNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Driver</p>
                    <p className="font-medium">{student.driverName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${student.isOnBus ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      {student.isOnBus ? 'Currently on bus' : 'Not on bus'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Check-in</p>
                    <p className="font-medium">{student.lastCheckIn || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {student.isOnBus && student.currentLocation && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <MapPin className="mr-2 h-5 w-5" /> Live Bus Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{student.currentLocation.lastUpdated}</p>
                  </div>
                  
                  <div className="aspect-video w-full h-64 bg-gray-100 rounded-md overflow-hidden">
                    <LiveBusLocation 
                      latitude={student.currentLocation.latitude}
                      longitude={student.currentLocation.longitude}
                      busNumber={student.busNumber}
                    />
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Estimated Arrival</p>
                      <p className="font-medium flex items-center">
                        <Clock className="mr-2 h-4 w-4" /> {student.estimatedArrival || 'Calculating...'}
                      </p>
                    </div>
                    <Button variant="outline" className="text-sishu-primary border-sishu-primary">
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No student information found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuardianDashboard;
