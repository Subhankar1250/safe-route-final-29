
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Shield, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface EmergencyAlertsProps {
  busNumber: string;
  driverName: string;
  currentLocation?: { latitude: number; longitude: number };
}

const EmergencyAlerts: React.FC<EmergencyAlertsProps> = ({ 
  busNumber, 
  driverName,
  currentLocation 
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [alertType, setAlertType] = useState<'mechanical' | 'medical' | 'security' | ''>('');
  const { toast } = useToast();
  
  const sendAlert = async () => {
    if (!alertType) {
      toast({
        title: "Error",
        description: "Please select an emergency type",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // In a real app, we would send this to a backend service
    // and notify all relevant stakeholders via push notifications
    const alertData = {
      type: alertType,
      message: message || getDefaultMessage(alertType),
      busNumber,
      driverName,
      timestamp: new Date().toISOString(),
      location: currentLocation || { latitude: 0, longitude: 0 }
    };
    
    // Simulate API call
    setTimeout(() => {
      console.log("Emergency alert sent:", alertData);
      
      toast({
        title: "Emergency Alert Sent",
        description: "All relevant stakeholders have been notified",
        variant: "default",
      });
      
      setIsLoading(false);
      setOpenDialog(false);
      setMessage('');
      setAlertType('');
    }, 1500);
  };
  
  const getDefaultMessage = (type: string) => {
    switch (type) {
      case 'mechanical':
        return "Bus is experiencing mechanical issues and requires assistance.";
      case 'medical':
        return "Medical emergency on the bus. Requiring immediate assistance.";
      case 'security':
        return "Security situation on the bus. Assistance required.";
      default:
        return "";
    }
  };
  
  const handleTriggerAlert = (type: 'mechanical' | 'medical' | 'security') => {
    setAlertType(type);
    setMessage(getDefaultMessage(type));
    setOpenDialog(true);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Emergency Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-4 h-24 border-yellow-400 hover:bg-yellow-50"
            onClick={() => handleTriggerAlert('mechanical')}
          >
            <AlertTriangle className="h-6 w-6 mb-2 text-yellow-500" />
            <span>Mechanical Issue</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-4 h-24 border-red-400 hover:bg-red-50"
            onClick={() => handleTriggerAlert('medical')}
          >
            <AlertTriangle className="h-6 w-6 mb-2 text-red-500" />
            <span>Medical Emergency</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-4 h-24 border-blue-400 hover:bg-blue-50"
            onClick={() => handleTriggerAlert('security')}
          >
            <Shield className="h-6 w-6 mb-2 text-blue-500" />
            <span>Security Alert</span>
          </Button>
        </div>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-500 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" /> 
                Emergency Alert
              </DialogTitle>
              <DialogDescription>
                This will send an immediate alert to all school administrators and affected guardians.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                <span>
                  {currentLocation 
                    ? `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}` 
                    : "Location data unavailable"}
                </span>
              </div>
              
              <Textarea 
                placeholder="Describe the emergency situation..." 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={sendAlert}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Emergency Alert"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EmergencyAlerts;
