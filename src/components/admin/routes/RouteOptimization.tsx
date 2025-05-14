
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, RotateCw, Route } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface OptimizationCriteria {
  minimizeDistance: boolean;
  minimizeTime: boolean;
  balanceStudentCount: boolean;
  avoidTrafficZones: boolean;
  considerSchoolHours: boolean;
}

const RouteOptimization: React.FC = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [criteria, setCriteria] = useState<OptimizationCriteria>({
    minimizeDistance: true,
    minimizeTime: true,
    balanceStudentCount: false,
    avoidTrafficZones: true,
    considerSchoolHours: false
  });
  const { toast } = useToast();
  
  const toggleCriteria = (key: keyof OptimizationCriteria) => {
    setCriteria(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const runOptimization = () => {
    setIsOptimizing(true);
    setProgress(0);
    
    // Simulate optimization process with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsOptimizing(false);
            toast({
              title: "Route Optimization Complete",
              description: "New optimized routes have been generated based on your criteria.",
            });
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 800);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Route className="h-5 w-5 mr-2" />
          Route Optimization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Select criteria for route optimization. The algorithm will generate the most efficient routes based on your selections.
        </p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="minimize-distance" 
              checked={criteria.minimizeDistance} 
              onCheckedChange={() => toggleCriteria('minimizeDistance')}
            />
            <label htmlFor="minimize-distance" className="text-sm font-medium leading-none cursor-pointer">
              Minimize total distance
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="minimize-time" 
              checked={criteria.minimizeTime}
              onCheckedChange={() => toggleCriteria('minimizeTime')}
            />
            <label htmlFor="minimize-time" className="text-sm font-medium leading-none cursor-pointer">
              Minimize travel time
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="balance-students" 
              checked={criteria.balanceStudentCount}
              onCheckedChange={() => toggleCriteria('balanceStudentCount')}
            />
            <label htmlFor="balance-students" className="text-sm font-medium leading-none cursor-pointer">
              Balance student count across buses
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="avoid-traffic" 
              checked={criteria.avoidTrafficZones}
              onCheckedChange={() => toggleCriteria('avoidTrafficZones')}
            />
            <label htmlFor="avoid-traffic" className="text-sm font-medium leading-none cursor-pointer">
              Avoid heavy traffic zones
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="school-hours" 
              checked={criteria.considerSchoolHours}
              onCheckedChange={() => toggleCriteria('considerSchoolHours')}
            />
            <label htmlFor="school-hours" className="text-sm font-medium leading-none cursor-pointer">
              Consider school hours for pickup/drop timing
            </label>
          </div>
        </div>
        
        {isOptimizing && (
          <div className="mb-4 space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500 text-center">
              {progress < 100 ? 'Processing...' : 'Finalizing routes...'}
            </p>
          </div>
        )}
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" disabled={isOptimizing}>
            Reset to Default
          </Button>
          <Button 
            onClick={runOptimization} 
            disabled={isOptimizing}
            className="flex items-center"
          >
            {isOptimizing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Optimizing Routes
              </>
            ) : (
              <>
                <RotateCw className="mr-2 h-4 w-4" />
                Optimize Routes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteOptimization;
