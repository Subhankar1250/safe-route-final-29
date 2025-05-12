
import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Guardian } from './types';

interface GuardianListProps {
  guardians: Guardian[];
  searchTerm: string;
  onDelete: (id: string) => void;
}

const GuardianList: React.FC<GuardianListProps> = ({ 
  guardians, 
  searchTerm, 
  onDelete 
}) => {
  const filteredGuardians = guardians.filter(guardian => 
    guardian.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    guardian.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guardian.phone.includes(searchTerm)
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Children</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredGuardians.map((guardian) => (
          <TableRow key={guardian.id}>
            <TableCell>{guardian.name}</TableCell>
            <TableCell>{guardian.email}</TableCell>
            <TableCell>{guardian.phone}</TableCell>
            <TableCell>{guardian.address}</TableCell>
            <TableCell>{guardian.children.join(', ')}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(guardian.id)}
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

export default GuardianList;
