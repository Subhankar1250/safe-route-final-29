
export interface Route {
  id: string;
  name: string;
  description: string;
  startPoint: string;
  endPoint: string;
  assignedDriverId?: string;
  assignedBusNumber?: string;
  stops: string[];
}

export interface Driver {
  id: string;
  name: string;
  busNumber: string;
}
