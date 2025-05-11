import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface TripRecord {
  id: string;
  busNumber: string;
  driverName: string;
  date: Date;
  startTime: string;
  endTime: string;
  route: string;
  status: 'completed' | 'cancelled' | 'in-progress';
}

const mockTrips: TripRecord[] = [
  { 
    id: '1', 
    busNumber: 'BUS001', 
    driverName: 'John Doe', 
    date: new Date(2023, 3, 15), 
    startTime: '7:30 AM', 
    endTime: '8:45 AM', 
    route: 'Morning pickup route A', 
    status: 'completed' 
  },
  { 
    id: '2', 
    busNumber: 'BUS001', 
    driverName: 'John Doe', 
    date: new Date(2023, 3, 15), 
    startTime: '2:30 PM', 
    endTime: '4:00 PM', 
    route: 'Afternoon drop-off route A', 
    status: 'completed' 
  },
  { 
    id: '3', 
    busNumber: 'BUS002', 
    driverName: 'Jane Smith', 
    date: new Date(2023, 3, 15), 
    startTime: '7:15 AM', 
    endTime: '8:30 AM', 
    route: 'Morning pickup route B', 
    status: 'completed' 
  },
  { 
    id: '4', 
    busNumber: 'BUS002', 
    driverName: 'Jane Smith', 
    date: new Date(), 
    startTime: '2:30 PM', 
    endTime: '', 
    route: 'Afternoon drop-off route B', 
    status: 'in-progress' 
  },
];

const AdminHistory: React.FC = () => {
  const [trips, setTrips] = useState<TripRecord[]>(mockTrips);
  const [dateFilter, setDateFilter] = useState('');
  const [busFilter, setBusFilter] = useState('');

  // Apply filters
  const filteredTrips = trips.filter(trip => {
    const matchDate = dateFilter ? trip.date.toLocaleDateString().includes(dateFilter) : true;
    const matchBus = busFilter ? 
      trip.busNumber.toLowerCase().includes(busFilter.toLowerCase()) || 
      trip.driverName.toLowerCase().includes(busFilter.toLowerCase()) : 
      true;
    return matchDate && matchBus;
  });

  // Sort by date and time (most recent first)
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    // First compare by date
    const dateComparison = b.date.getTime() - a.date.getTime();
    if (dateComparison !== 0) return dateComparison;
    
    // If same date, compare by start time
    return a.startTime.localeCompare(b.startTime);
  });

  const getStatusBadgeClass = (status: TripRecord['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trip History</h2>
        <Button>
          <Calendar className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Filter by date (MM/DD/YYYY)"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Input
            placeholder="Filter by bus or driver"
            value={busFilter}
            onChange={(e) => setBusFilter(e.target.value)}
          />
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Bus</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTrips.map((trip) => (
            <TableRow key={trip.id}>
              <TableCell>{trip.date.toLocaleDateString()}</TableCell>
              <TableCell>{trip.busNumber}</TableCell>
              <TableCell>{trip.driverName}</TableCell>
              <TableCell>{trip.startTime}</TableCell>
              <TableCell>{trip.endTime || 'N/A'}</TableCell>
              <TableCell>{trip.route}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(trip.status)}`}>
                  {trip.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminHistory;
