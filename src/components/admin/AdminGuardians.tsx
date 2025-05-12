
import React from 'react';
import GuardianSearch from './guardians/GuardianSearch';
import GuardianList from './guardians/GuardianList';
import AddGuardianDialog from './guardians/AddGuardianDialog';
import { useGuardians } from './guardians/useGuardians';

const AdminGuardians: React.FC = () => {
  const {
    guardians,
    searchTerm,
    setSearchTerm,
    newGuardian,
    setNewGuardian,
    handleAddGuardian,
    handleDeleteGuardian
  } = useGuardians();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Guardians</h2>
        <div className="flex space-x-2">
          <GuardianSearch 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
          
          <AddGuardianDialog 
            newGuardian={newGuardian}
            setNewGuardian={setNewGuardian}
            onAdd={handleAddGuardian}
          />
        </div>
      </div>
      
      <GuardianList 
        guardians={guardians} 
        searchTerm={searchTerm}
        onDelete={handleDeleteGuardian} 
      />
    </div>
  );
};

export default AdminGuardians;
