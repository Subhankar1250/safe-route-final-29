
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Plus, Edit, Trash, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Guardian {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  children: string[];
}

const mockGuardians: Guardian[] = [
  { id: '1', name: 'Robert Johnson', email: 'robert@example.com', phone: '555-1111', address: '123 Main St', children: ['Alice Johnson'] },
  { id: '2', name: 'Mary Smith', email: 'mary@example.com', phone: '555-2222', address: '456 Oak St', children: ['Bob Smith'] },
  { id: '3', name: 'Lucy Brown', email: 'lucy@example.com', phone: '555-3333', address: '789 Pine St', children: ['Charlie Brown'] },
];

const AdminGuardians: React.FC = () => {
  const [guardians, setGuardians] = useState<Guardian[]>(mockGuardians);
  const [searchTerm, setSearchTerm] = useState('');
  const [newGuardian, setNewGuardian] = useState<Omit<Guardian, 'id' | 'children'>>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const { toast } = useToast();

  const filteredGuardians = guardians.filter(guardian => 
    guardian.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    guardian.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guardian.phone.includes(searchTerm)
  );

  const handleAddGuardian = () => {
    // Here would be the actual Supabase implementation
    const id = Math.random().toString(36).substr(2, 9);
    const guardian = { ...newGuardian, id, children: [] };
    setGuardians([...guardians, guardian as Guardian]);
    toast({
      title: 'Success',
      description: 'New guardian added successfully',
    });
  };

  const handleDeleteGuardian = (id: string) => {
    // Here would be the actual Supabase implementation
    setGuardians(guardians.filter(guardian => guardian.id !== id));
    toast({
      title: 'Success',
      description: 'Guardian deleted successfully',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Guardians</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search guardians..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Guardian
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Guardian</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={newGuardian.name}
                    onChange={(e) => setNewGuardian({...newGuardian, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={newGuardian.email}
                    onChange={(e) => setNewGuardian({...newGuardian, email: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    value={newGuardian.phone}
                    onChange={(e) => setNewGuardian({...newGuardian, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    value={newGuardian.address}
                    onChange={(e) => setNewGuardian({...newGuardian, address: e.target.value})}
                  />
                </div>
                <Button onClick={handleAddGuardian} className="w-full">
                  Add Guardian
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
                    onClick={() => handleDeleteGuardian(guardian.id)}
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

export default AdminGuardians;
