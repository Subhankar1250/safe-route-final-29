
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Key } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import GuardianCredentialManager from './GuardianCredentialManager';

interface Driver {
  id: string;
  name: string;
  busNumber: string;
}

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

interface StudentListProps {
  students: Student[];
  drivers: Driver[];
  searchTerm: string;
  onDelete: (id: string) => void;
}

const StudentList: React.FC<StudentListProps> = ({ 
  students, 
  drivers,
  searchTerm,
  onDelete
}) => {
  const [showCredentials, setShowCredentials] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.guardianName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const toggleShowCredentials = (id: string) => {
    setShowCredentials(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
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
              <div className="space-y-2">
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
                <GuardianCredentialManager
                  studentId={student.id}
                  studentName={student.name}
                  guardianName={student.guardianName}
                  currentUsername={student.guardianUsername || ''}
                />
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(student.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default StudentList;
