
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import AddRouteForm from './AddRouteForm';
import { Driver, Route } from './types';

interface AddRouteDialogProps {
  drivers: Driver[];
  onAddRoute: (route: Omit<Route, 'id'>) => void;
}

const AddRouteDialog: React.FC<AddRouteDialogProps> = ({ drivers, onAddRoute }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Route
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Transport Route</DialogTitle>
        </DialogHeader>
        <AddRouteForm drivers={drivers} onAddRoute={onAddRoute} />
      </DialogContent>
    </Dialog>
  );
};

export default AddRouteDialog;
