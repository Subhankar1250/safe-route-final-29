
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { generateCredentials } from '@/utils/authUtils';
import { Student, Driver } from './students/types';
import StudentList from './students/StudentList';
import StudentForm from './students/StudentForm';
import StudentSearch from './students/StudentSearch';
import { supabase } from '@/integrations/supabase/client';

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
  
  const { toast } = useToast();

  // Fetch students and drivers from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch drivers
        const { data: driversData, error: driversError } = await supabase
          .from('drivers')
          .select('id, name, bus_number, phone, license, status');
        
        if (driversError) {
          toast({
            variant: "destructive",
            title: "Error fetching drivers",
            description: driversError.message
          });
          return;
        }
        
        // Transform drivers data to match our Driver type
        const transformedDrivers = driversData.map(driver => ({
          id: driver.id,
          name: driver.name,
          busNumber: driver.bus_number,
          phone: driver.phone,
          license: driver.license,
          status: driver.status as "active" | "inactive"
        }));
        
        setDrivers(transformedDrivers);
        
        // Fetch students
        const { data: studentsData, error: studentsError } = await supabase
          .from('students')
          .select('id, name, grade, guardian_name, pickup_point, bus_number, driver_id');
        
        if (studentsError) {
          toast({
            variant: "destructive",
            title: "Error fetching students",
            description: studentsError.message
          });
          return;
        }
        
        // Fetch guardian credentials for each student
        const studentsWithCredentials = await Promise.all(
          studentsData.map(async (student) => {
            const { data: credentialsData } = await supabase
              .from('guardian_credentials')
              .select('username, password')
              .eq('student_id', student.id)
              .single();
            
            return {
              id: student.id,
              name: student.name,
              grade: student.grade,
              guardianName: student.guardian_name,
              pickupPoint: student.pickup_point,
              busNumber: student.bus_number,
              driverId: student.driver_id,
              guardianUsername: credentialsData?.username || '',
              guardianPassword: credentialsData?.password || ''
            };
          })
        );
        
        setStudents(studentsWithCredentials);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data from database"
        });
      }
    };
    
    fetchData();
  }, [toast]);

  const handleAddStudent = async () => {
    // Generate guardian credentials based on the student's name for stronger association
    const guardianCredentials = generateCredentials(newStudent.name, 'guardian');
    
    try {
      // 1. Insert the student record first
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert([
          {
            name: newStudent.name,
            grade: newStudent.grade,
            guardian_name: newStudent.guardianName,
            pickup_point: newStudent.pickupPoint,
            bus_number: newStudent.busNumber,
            driver_id: newStudent.driverId
          }
        ])
        .select()
        .single();
      
      if (studentError) throw studentError;
      
      // 2. Store guardian credentials with link to student
      const { error: credentialsError } = await supabase
        .from('guardian_credentials')
        .insert([
          {
            student_id: studentData.id,
            username: guardianCredentials.username,
            password: guardianCredentials.password
          }
        ]);
      
      if (credentialsError) throw credentialsError;
      
      // 3. Create the guardian user account in Supabase Auth
      const email = `${guardianCredentials.username}@sishu-tirtha.app`;
      const { error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: guardianCredentials.password,
        email_confirm: true,
        user_metadata: {
          role: 'guardian',
          student_id: studentData.id
        }
      });
      
      if (authError) {
        console.warn("Could not create auth user automatically:", authError);
        // Continue anyway as the credentials are stored separately
      }
      
      // 4. Add the complete student to our state
      const newStudentWithCredentials: Student = {
        ...newStudent,
        id: studentData.id,
        guardianUsername: guardianCredentials.username,
        guardianPassword: guardianCredentials.password
      };
      
      setStudents([...students, newStudentWithCredentials]);
      
      // 5. Reset the form
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
    } catch (error: any) {
      console.error("Error adding student:", error);
      toast({
        variant: "destructive",
        title: "Error adding student",
        description: error.message || "An unknown error occurred"
      });
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      // Delete the student (cascade will also delete guardian credentials)
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setStudents(students.filter(student => student.id !== id));
      
      toast({
        title: 'Success',
        description: 'Student and associated guardian account deleted successfully',
      });
    } catch (error: any) {
      console.error("Error deleting student:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete student"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Students</h2>
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
      </div>
      
      <StudentList 
        students={students}
        drivers={drivers}
        searchTerm={searchTerm}
        onDelete={handleDeleteStudent}
      />
    </div>
  );
};

export default AdminStudents;
