
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

// Mock data for students
const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alice Johnson",
    grade: "5",
    guardianName: "Robert Johnson",
    pickupPoint: "Main Street",
    busNumber: "B001",
    driverId: "1",
    guardianUsername: "guardian1",
    guardianPassword: "guardian123"
  },
  {
    id: "2",
    name: "Michael Smith",
    grade: "3",
    guardianName: "Sarah Smith",
    pickupPoint: "Oak Avenue",
    busNumber: "B002",
    driverId: "2",
    guardianUsername: "guardian2",
    guardianPassword: "guardian123"
  },
  {
    id: "3",
    name: "Emily Davis",
    grade: "4",
    guardianName: "James Davis",
    pickupPoint: "Pine Road",
    busNumber: "B001",
    driverId: "1",
    guardianUsername: "guardian3",
    guardianPassword: "guardian123"
  }
];

// Mock data for drivers
const mockDrivers: Driver[] = [
  {
    id: "1",
    name: "John Smith",
    busNumber: "B001",
    phone: "555-123-4567",
    license: "DL12345678",
    status: "active"
  },
  {
    id: "2",
    name: "Emily Johnson",
    busNumber: "B002",
    phone: "555-987-6543",
    license: "DL87654321",
    status: "active"
  },
  {
    id: "3",
    name: "Michael Wilson",
    busNumber: "B003",
    phone: "555-456-7890",
    license: "DL45678901",
    status: "inactive"
  }
];

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

  // Load mock data on component mount
  useEffect(() => {
    setStudents(mockStudents);
    setDrivers(mockDrivers);
  }, []);

  const handleAddStudent = async () => {
    // Generate guardian credentials based on the student's name for stronger association
    const guardianCredentials = generateCredentials(newStudent.name, 'guardian');
    
    try {
      // Create a new student with an ID and credentials
      const newStudentWithCredentials: Student = {
        ...newStudent,
        id: Date.now().toString(),
        guardianUsername: guardianCredentials.username,
        guardianPassword: guardianCredentials.password
      };
      
      setStudents([...students, newStudentWithCredentials]);
      
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
