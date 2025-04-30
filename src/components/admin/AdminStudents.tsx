
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Settings } from 'lucide-react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useToast } from '@/components/ui/use-toast';
import { generateCredentials } from '@/utils/authUtils';
import { Student, Driver } from './students/types';
import StudentList from './students/StudentList';
import StudentForm from './students/StudentForm';
import StudentSearch from './students/StudentSearch';
import AdminPasswordChange from './profile/AdminPasswordChange';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({
    name: '',
    grade: '',
    guardianName: '',
    pickupPoint: '',
    busNumber: '',
    driverId: ''
  });
  const [activeTab, setActiveTab] = useState<"students" | "profile">("students");
  
  const { firestore } = useFirebase();
  const { toast } = useToast();

  // Mock data loading - in a real app, would fetch from Supabase
  useEffect(() => {
    // Mock student data
    const mockStudents = [
      { id: '1', name: 'Alice Johnson', grade: '3A', guardianName: 'Robert Johnson', pickupPoint: 'Main St & 1st Ave', busNumber: 'BUS001', driverId: '1', guardianUsername: 'rjohnson', guardianPassword: '********' },
      { id: '2', name: 'Bob Smith', grade: '2B', guardianName: 'Mary Smith', pickupPoint: 'Oak St & 5th Ave', busNumber: 'BUS002', driverId: '2', guardianUsername: 'msmith', guardianPassword: '********' },
      { id: '3', name: 'Charlie Brown', grade: '4C', guardianName: 'Lucy Brown', pickupPoint: 'Pine St & 3rd Ave', busNumber: 'BUS001', driverId: '1', guardianUsername: 'lbrown', guardianPassword: '********' },
    ];
    setStudents(mockStudents);

    // Mock driver data
    const mockDrivers = [
      { id: '1', name: 'John Doe', busNumber: 'BUS001' },
      { id: '2', name: 'Jane Smith', busNumber: 'BUS002' },
      { id: '3', name: 'Mike Johnson', busNumber: 'BUS003' },
    ];
    setDrivers(mockDrivers);
  }, []);

  const handleAddStudent = () => {
    // Generate guardian credentials based on the student's name for stronger association
    // This creates a username with the SishuTirtha prefix and a secure password
    const guardianCredentials = generateCredentials(newStudent.name, 'guardian');
    
    // Here would be the actual Supabase implementation to:
    // 1. Create guardian user account with the generated credentials
    // 2. Store the student details with link to guardian
    
    const id = Math.random().toString(36).substr(2, 9);
    
    // Create the new student record with guardian credentials
    const student = { 
      ...newStudent, 
      id,
      guardianUsername: guardianCredentials.username,
      guardianPassword: guardianCredentials.password
    };
    
    setStudents([...students, student as Student]);
    
    // Reset the form
    setNewStudent({
      name: '',
      grade: '',
      guardianName: '',
      pickupPoint: '',
      busNumber: '',
      driverId: ''
    });
    
    toast({
      title: 'Success',
      description: `New student added with guardian account (${guardianCredentials.username})`,
    });
  };

  const handleDeleteStudent = (id: string) => {
    // Here would be the actual Supabase implementation
    // to delete both student and associated guardian account
    setStudents(students.filter(student => student.id !== id));
    toast({
      title: 'Success',
      description: 'Student and associated guardian account deleted successfully',
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "students" | "profile")}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="students">Student Management</TabsTrigger>
            <TabsTrigger value="profile">Admin Profile</TabsTrigger>
          </TabsList>
          {activeTab === "students" && (
            <div className="flex space-x-2">
              <StudentSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                  </DialogHeader>
                  <StudentForm 
                    newStudent={newStudent}
                    setNewStudent={setNewStudent}
                    drivers={drivers}
                    onAdd={handleAddStudent}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
        
        <TabsContent value="students" className="mt-4">
          <StudentList 
            students={students}
            drivers={drivers}
            searchTerm={searchTerm}
            onDelete={handleDeleteStudent}
          />
        </TabsContent>
        
        <TabsContent value="profile" className="mt-4">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5" /> 
                Admin Profile Settings
              </h2>
              <AdminPasswordChange />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminStudents;
