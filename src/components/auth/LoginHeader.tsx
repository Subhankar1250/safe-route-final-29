
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const LoginHeader: React.FC = () => {
  return (
    <CardHeader className="space-y-1 text-center">
      <div className="flex justify-center mb-2">
        <img 
          src="/lovable-uploads/5660de73-133f-4d61-aa57-08b2be7b455d.png" 
          alt="Sishu Tirtha Safe Route" 
          className="h-24 w-24 shadow-lg rounded-full" 
        />
      </div>
      <CardTitle className="text-2xl font-bold text-primary">Sishu Tirtha Safe Route</CardTitle>
      <div className="flex items-center justify-center space-x-1 text-sm">
        <span>Baradongal</span>
        <ArrowRight className="h-4 w-4" />
        <span>Arambagh</span>
        <ArrowRight className="h-4 w-4" />
        <span>Hooghly</span>
      </div>
      <CardDescription>The safest route for your child's journey</CardDescription>
    </CardHeader>
  );
};

export default LoginHeader;
