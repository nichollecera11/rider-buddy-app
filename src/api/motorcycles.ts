import {
  Brand,
  Motorcycle,
  RegisterMotorcyclePayload,
} from "../types/motorcycle";
import client from "./client";

export async function fetchMotorcycles(): Promise<Motorcycle[]> {
  const response = await client.get("/user-motorcycles");
  return response.data.data;
}

export async function fetchMotorcycleById(id: number): Promise<Motorcycle> {
  const response = await client.get(`/user-motorcycles/${id}`);
  return response.data.data;
}
export async function fetchArchivedMotorcycles(): Promise<Motorcycle[]> {
  const response = await client.get("/user-motorcycles/archived");
  return response.data.data;
}
export async function fetchArchivedMotorcycleById(
  id: number,
): Promise<Motorcycle> {
  const response = await client.get(`/user-motorcycles/archived/${id}`);
  return response.data.data;
}

export async function fetchBrands(): Promise<Brand[]> {
  const response = await client.get("/brands");
  return response.data.data;
}

export async function registerMotorcycle(
  payload: RegisterMotorcyclePayload,
): Promise<Motorcycle> {
  const response = await client.post("/user-motorcycles", payload);
  return response.data.data;
}
