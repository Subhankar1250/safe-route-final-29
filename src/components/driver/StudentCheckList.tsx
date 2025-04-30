
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Student {
  id: string;
  name: string;
  grade: string;
  boardedAt: string | null;
  leftAt: string | null;
  isOnBoard: boolean;
}

interface StudentCheckListProps {
  isActive: boolean;
}

const StudentCheckList: React.FC<StudentCheckListProps> = ({ isActive }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Alice Johnson', grade: '3A', boardedAt: null, leftAt: null, isOnBoard: false },
    { id: '2', name: 'Bob Smith', grade: '2B', boardedAt: null, leftAt: null, isOnBoard: false },
    { id: '3', name: 'Charlie Brown', grade: '4C', boardedAt: null, leftAt: null, isOnBoard: false },
    { id: '4', name: 'Diana Ross', grade: '3A', boardedAt: null, leftAt: null, isOnBoard: false },
    { id: '5', name: 'Edward Thompson', grade: '5B', boardedAt: null, leftAt: null, isOnBoard: false },
  ]);
  
  const { toast } = useToast();
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCheckInOut = (studentId: string) => {
    if (!isActive) {
      toast({
        title: "Trip Not Active",
        description: "Please start the trip before checking students in/out.",
        variant: "destructive",
      });
      return;
    }
    
    setStudents(currentStudents => 
      currentStudents.map(student => {
        if (student.id === studentId) {
          if (student.isOnBoard) {
            // Check out the student
            const updatedStudent = {
              ...student,
              isOnBoard: false,
              leftAt: new Date().toLocaleTimeString()
            };
            
            // In a real app, this would send the data to Supabase
            console.log(`Student checked out: ${student.name} at ${updatedStudent.leftAt}`);
            
            toast({
              title: "Student Checked Out",
              description: `${student.name} has been checked out at ${updatedStudent.leftAt}`,
            });
            
            return updatedStudent;
          } else {
            // Check in the student
            const updatedStudent = {
              ...student,
              isOnBoard: true,
              boardedAt: new Date().toLocaleTimeString()
            };
            
            // In a real app, this would send the data to Supabase
            console.log(`Student checked in: ${student.name} at ${updatedStudent.boardedAt}`);
            
            toast({
              title: "Student Checked In",
              description: `${student.name} has been checked in at ${updatedStudent.boardedAt}`,
            });
            
            return updatedStudent;
          }
        }
        return student;
      })
    );
  };
  
  const getStatusText = (student: Student) => {
    if (student.isOnBoard) {
      return `Boarded at ${student.boardedAt}`;
    } else if (student.boardedAt && student.leftAt) {
      return `Boarded at ${student.boardedAt}, left at ${student.leftAt}`;
    }
    return "Not boarded";
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Student Check-in/out</span>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredStudents.map(student => (
            <div key={student.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`student-${student.id}`}
                  checked={student.isOnBoard}
                  onCheckedChange={() => handleCheckInOut(student.id)}
                  disabled={!isActive}
                />
                <div>
                  <label htmlFor={`student-${student.id}`} className="font-medium cursor-pointer">
                    {student.name}
                  </label>
                  <p className="text-sm text-gray-500">Grade: {student.grade}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm ${student.isOnBoard ? 'text-green-600' : 'text-gray-500'}`}>
                  {getStatusText(student)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!isActive}
                  onClick={() => handleCheckInOut(student.id)}
                >
                  {student.isOnBoard ? 'Check Out' : 'Check In'}
                </Button>
              </div>
            </div>
          ))}
          
          {filteredStudents.length === 0 && (
            <p className="text-center py-4 text-gray-500">No students found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCheckList;
