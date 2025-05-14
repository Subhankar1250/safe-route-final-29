
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, XCircle } from "lucide-react";

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  present: boolean;
  boardedAt?: string;
  leftAt?: string;
  tripId: string;
}

interface Student {
  id: string;
  name: string;
}

interface StudentAttendanceProps {
  tripId: string;
  isActive: boolean;
}

const StudentAttendance: React.FC<StudentAttendanceProps> = ({ tripId, isActive }) => {
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Alice Johnson' },
    { id: '2', name: 'Bob Smith' },
    { id: '3', name: 'Charlie Brown' },
    { id: '4', name: 'Diana Ross' },
    { id: '5', name: 'Edward Thompson' },
  ]);
  
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const { toast } = useToast();
  const todayDate = new Date().toISOString().split('T')[0];
  
  // Initialize attendance records when component mounts
  useEffect(() => {
    const initialAttendance = students.map(student => ({
      id: `${student.id}-${todayDate}`,
      studentId: student.id,
      studentName: student.name,
      date: todayDate,
      present: false,
      tripId
    }));
    
    // In a real app, we would fetch existing attendance records from database
    setAttendance(initialAttendance);
  }, [students, tripId]);
  
  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    if (!isActive) {
      toast({
        title: "Trip Not Active",
        description: "Please start the trip before marking attendance.",
        variant: "destructive",
      });
      return;
    }
    
    const currentTime = new Date().toLocaleTimeString();
    
    setAttendance(current => 
      current.map(record => {
        if (record.studentId === studentId) {
          const updatedRecord = {
            ...record,
            present: isPresent,
            boardedAt: isPresent ? currentTime : record.boardedAt,
          };
          
          // In a real app, we would send this data to the database
          console.log(`Student attendance updated: ${record.studentName} - ${isPresent ? 'Present' : 'Absent'}`);
          
          return updatedRecord;
        }
        return record;
      })
    );
    
    toast({
      title: `Student ${isPresent ? 'Present' : 'Absent'}`,
      description: `${students.find(s => s.id === studentId)?.name} marked as ${isPresent ? 'present' : 'absent'}.`,
    });
  };
  
  const markAllPresent = () => {
    if (!isActive) {
      toast({
        title: "Trip Not Active",
        description: "Please start the trip before marking attendance.",
        variant: "destructive",
      });
      return;
    }
    
    const currentTime = new Date().toLocaleTimeString();
    
    setAttendance(current => 
      current.map(record => ({
        ...record,
        present: true,
        boardedAt: currentTime
      }))
    );
    
    toast({
      title: "All Students Present",
      description: "All students have been marked as present.",
    });
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Daily Attendance</CardTitle>
          <Button 
            variant="outline" 
            onClick={markAllPresent}
            disabled={!isActive}
          >
            Mark All Present
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {attendance.map(record => (
            <div key={record.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`attendance-${record.studentId}`}
                  checked={record.present}
                  onCheckedChange={(checked) => handleAttendanceChange(record.studentId, !!checked)}
                  disabled={!isActive}
                />
                <label htmlFor={`attendance-${record.studentId}`} className="font-medium cursor-pointer">
                  {record.studentName}
                </label>
              </div>
              <div className="flex items-center">
                {record.present ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    <span className="text-sm">Present at {record.boardedAt}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-400">
                    <XCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Not recorded</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {attendance.length === 0 && (
            <p className="text-center py-4 text-gray-500">No students assigned to this trip.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentAttendance;
