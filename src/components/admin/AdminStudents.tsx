
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { useFirebase } from '@/contexts/FirebaseContext';
import { Plus, Edit, Trash, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Student {
  id: string;
  name: string;
  grade: string;
  guardianName: string;
  pickupPoint: string;
  busNumber: string;
}

const mockStudents: Student[] = [
  { id: '1', name: 'Alice Johnson', grade: '3A', guardianName: 'Robert Johnson', pickupPoint: 'Main St & 1st Ave', busNumber: 'BUS001' },
  { id: '2', name: 'Bob Smith', grade: '2B', guardianName: 'Mary Smith', pickupPoint: 'Oak St & 5th Ave', busNumber: 'BUS002' },
  { id: '3', name: 'Charlie Brown', grade: '4C', guardianName: 'Lucy Brown', pickupPoint: 'Pine St & 3rd Ave', busNumber: 'BUS001' },
];

const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({
    name: '',
    grade: '',
    guardianName: '',
    pickupPoint: '',
    busNumber: ''
  });
  
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.guardianName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    // Here would be the actual Firestore implementation
    const id = Math.random().toString(36).substr(2, 9);
    const student = { ...newStudent, id };
    setStudents([...students, student as Student]);
    toast({
      title: 'Success',
      description: 'New student added successfully',
    });
  };

  const handleDeleteStudent = (id: string) => {
    // Here would be the actual Firestore implementation
    setStudents(students.filter(student => student.id !== id));
    toast({
      title: 'Success',
      description: 'Student deleted successfully',
    });
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
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
                  <Label htmlFor="busNumber">Bus Number</Label>
                  <Input 
                    id="busNumber" 
                    value={newStudent.busNumber}
                    onChange={(e) => setNewStudent({...newStudent, busNumber: e.target.value})}
                  />
                </div>
                <Button onClick={handleAddStudent} className="w-full">
                  Add Student
                </Button>
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
