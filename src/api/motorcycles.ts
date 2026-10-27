import { Motorcycle } from "../types/motorcycle";
import client from "./client";

export async function fetchMotorcycles(): Promise<Motorcycle[]> {
  const response = await client.get("/user-motorcycles");
  return response.data.data;
}
