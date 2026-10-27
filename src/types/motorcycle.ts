export interface Motorcycle {
  id: number;
  user_id?: number;
  brand: string;
  model: string;
  year?: number | null;
  plate_number?: string | null;
  color?: string | null;
  engine_number?: string | null;
  chassis_number?: string | null;
  is_main: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
