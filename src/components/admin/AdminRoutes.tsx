
import React from 'react';
import RoutesList from './routes/RoutesList';
import RouteSearch from './routes/RouteSearch';
import AddRouteDialog from './routes/AddRouteDialog';
import { useRoutes } from './routes/useRoutes';

const AdminRoutes: React.FC = () => {
  const {
    routes,
    drivers,
    searchTerm,
    setSearchTerm,
    handleAddRoute,
    handleDeleteRoute,
  } = useRoutes();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Routes</h2>
        <div className="flex space-x-2">
          <RouteSearch 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
          
          <AddRouteDialog 
            drivers={drivers} 
            onAddRoute={handleAddRoute} 
          />
        </div>
      </div>
      
      <RoutesList 
        routes={routes} 
        drivers={drivers} 
        onDelete={handleDeleteRoute} 
      />
    </div>
  );
};

export default AdminRoutes;
