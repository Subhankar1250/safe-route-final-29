
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { useFirebase } from '@/contexts/FirebaseContext';
import { Plus, Edit, Trash, Search, Key } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateCredentials } from '@/utils/authUtils';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  name: string;
  grade: string;
  guardianName: string;
  pickupPoint: string;
  busNumber: string;
  driverId?: string;
  guardianUsername?: string;
  guardianPassword?: string;
}

interface Driver {
  id: string;
  name: string;
  busNumber: string;
}

const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCredentials, setShowCredentials] = useState<{[key: string]: boolean}>({});
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({
    name: '',
    grade: '',
    guardianName: '',
    pickupPoint: '',
    busNumber: '',
    driverId: ''
  });
  
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

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.guardianName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    // Generate guardian credentials
    const guardianCredentials = generateCredentials(newStudent.guardianName, 'guardian');
    
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
      description: 'New student added with guardian account',
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

  const toggleShowCredentials = (id: string) => {
    setShowCredentials(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Update bus number when driver changes
  const handleDriverChange = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (driver) {
      setNewStudent({
        ...newStudent,
        driverId,
        busNumber: driver.busNumber
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Students</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
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
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Student Full Name</Label>
                  <Input 
                    id="name" 
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade/Class</Label>
                  <Input 
                    id="grade"
                    value={newStudent.grade}
                    onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardianName">Guardian Name</Label>
                  <Input 
                    id="guardianName" 
                    value={newStudent.guardianName}
                    onChange={(e) => setNewStudent({...newStudent, guardianName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickupPoint">Pickup Point</Label>
                  <Input 
                    id="pickupPoint" 
                    value={newStudent.pickupPoint}
                    onChange={(e) => setNewStudent({...newStudent, pickupPoint: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver">Assign Driver</Label>
                  <Select 
                    value={newStudent.driverId || undefined} 
                    onValueChange={handleDriverChange}
                  >
                    <SelectTrigger id="driver">
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map(driver => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name} - {driver.busNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Bus number will be automatically assigned based on the driver
                  </p>
                </div>
                <Button onClick={handleAddStudent} className="w-full">
                  Add Student
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  A guardian account will be automatically created for the student
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Guardian</TableHead>
            <TableHead>Pickup Point</TableHead>
            <TableHead>Bus Number</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Guardian Credentials</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.grade}</TableCell>
              <TableCell>{student.guardianName}</TableCell>
              <TableCell>{student.pickupPoint}</TableCell>
              <TableCell>{student.busNumber}</TableCell>
              <TableCell>
                {drivers.find(d => d.id === student.driverId)?.name || 'Not assigned'}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => toggleShowCredentials(student.id)}
                >
                  <Key className="h-3.5 w-3.5" />
                  {showCredentials[student.id] ? 'Hide' : 'Show'}
                </Button>
                {showCredentials[student.id] && (
                  <div className="mt-1 text-xs">
                    <p>Username: {student.guardianUsername}</p>
                    <p>Password: {student.guardianPassword}</p>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminStudents;
