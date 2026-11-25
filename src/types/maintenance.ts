export interface MaintenanceLog {
  id: number;
  user_motorcycle_id: number;
  consultation_id: number | null;
  mechanic_id: number | null;
  service_type: string;
  description: string | null;
  odometer_reading: number;
  service_date: string;
  cost: number | string;
  is_verified_by_mechanic: boolean;

  mechanic?: {
    id: number;
    user?: {
      id: number;
      name: string;
    };
  } | null;
}

export interface MaintenanceLogResponse {
  message: string;
  count: number;
  data: MaintenanceLog[];
}
