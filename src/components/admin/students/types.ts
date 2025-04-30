
export interface Student {
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

export interface Driver {
  id: string;
  name: string;
  busNumber: string;
}
