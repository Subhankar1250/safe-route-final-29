
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { generateCredentials } from '@/utils/authUtils';
import { Student, Driver } from './types';

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

export const useStudents = () => {
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

  return {
    students,
    drivers,
    searchTerm,
    setSearchTerm,
    newStudent,
    setNewStudent,
    handleAddStudent,
    handleDeleteStudent
  };
};

export default useStudents;
