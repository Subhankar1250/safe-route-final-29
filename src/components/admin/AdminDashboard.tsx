
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { 
  Users, File, Map, Clock, Settings, Database, Key, UserCircle
} from 'lucide-react';

import AdminDrivers from './AdminDrivers';
import AdminStudents from './AdminStudents';
import AdminGuardians from './AdminGuardians';
import AdminLocations from './AdminLocations';
import AdminQRCode from './AdminQRCode';
import AdminHistory from './AdminHistory';
import CredentialGenerator from './credentials/CredentialGenerator';
import AdminProfile from './AdminProfile';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useState({ name: 'Admin User' });
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
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
            <h1 className="text-xl font-bold">Sishu Tirtha Admin Panel</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span>{user.name}</span>
            <Menubar className="border-none bg-transparent">
              <MenubarMenu>
                <MenubarTrigger className="cursor-pointer text-white">
                  <Settings className="h-5 w-5" />
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={() => navigate('/admin/profile')}>My Profile</MenubarItem>
                  <MenubarItem onClick={handleLogout}>Logout</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4 mb-8">
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-4 h-24"
            onClick={() => navigate('/admin/drivers')}
          >
            <Users className="h-6 w-6 mb-2" />
            <span>Drivers</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-4 h-24"
            onClick={() => navigate('/admin/students')}
          >
            <Users className="h-6 w-6 mb-2" />
            <span>Students</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-4 h-24"
            onClick={() => navigate('/admin/guardians')}
          >
            <Users className="h-6 w-6 mb-2" />
            <span>Guardians</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-4 h-24"
            onClick={() => navigate('/admin/locations')}
          >
            <Map className="h-6 w-6 mb-2" />
            <span>Live Tracking</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-4 h-24"
            onClick={() => navigate('/admin/history')}
          >
            <Clock className="h-6 w-6 mb-2" />
            <span>Trip History</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-4 h-24"
            onClick={() => navigate('/admin/qrcode')}
          >
            <File className="h-6 w-6 mb-2" />
            <span>QR Codes</span>
          </Button>

          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-4 h-24"
            onClick={() => navigate('/admin/credentials')}
          >
            <Key className="h-6 w-6 mb-2" />
            <span>Credentials</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-4 h-24"
            onClick={() => navigate('/admin/profile')}
          >
            <UserCircle className="h-6 w-6 mb-2" />
            <span>My Profile</span>
          </Button>
        </div>

        <Card className="p-6">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/dashboard" element={<AdminOverview />} />
            <Route path="/drivers" element={<AdminDrivers />} />
            <Route path="/students" element={<AdminStudents />} />
            <Route path="/guardians" element={<AdminGuardians />} />
            <Route path="/locations" element={<AdminLocations />} />
            <Route path="/history" element={<AdminHistory />} />
            <Route path="/qrcode" element={<AdminQRCode />} />
            <Route path="/credentials" element={<CredentialGenerator />} />
            <Route path="/profile" element={<AdminProfile />} />
          </Routes>
        </Card>
      </div>
    </div>
  );
};

const AdminOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-lg mb-2">Active Buses</h3>
          <div className="text-3xl font-bold text-sishu-primary">5</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-lg mb-2">Total Drivers</h3>
          <div className="text-3xl font-bold text-sishu-primary">8</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-lg mb-2">Total Students</h3>
          <div className="text-3xl font-bold text-sishu-primary">120</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
