export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface Motorcycle {
  id: number;
  user_id: number;
  brand_id: number;
  brand: Brand;
  model: string;
  year_model?: string | null;
  engine_capacity?: number | null;
  transmission?:
    | "manual"
    | "automatic"
    | "semi_automatic"
    | "none_electric"
    | null;
  fuel_type?: "gasoline" | "electric" | null;
  color?: string | null;
  plate_number: string;
  engine_number?: string | null;
  chassis_number?: string | null;
  last_registration_date?: string | null;
  insurance_expiry?: string | null;
  current_odometer?: number | null;
  is_main: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RegisterMotorcyclePayload {
  brand_id: number;
  model: string;
  year_model?: string;
  plate_number: string;
  engine_number?: string;
  chassis_number?: string;
  engine_capacity?: number;
  transmission?: Motorcycle["transmission"];
  fuel_type?: Motorcycle["fuel_type"];
  color?: string;
  last_registration_date?: string;
  insurance_expiry?: string;
  current_odometer?: number;
  is_main: boolean;
  is_active: boolean;
}
