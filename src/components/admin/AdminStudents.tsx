
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import StudentList from './students/StudentList';
import StudentForm from './students/StudentForm';
import StudentSearch from './students/StudentSearch';
import { useStudents } from './students/useStudents';

const AdminStudents: React.FC = () => {
  const {
    students,
    drivers,
    searchTerm,
    setSearchTerm,
    newStudent,
    setNewStudent,
    handleAddStudent,
    handleDeleteStudent
  } = useStudents();

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
