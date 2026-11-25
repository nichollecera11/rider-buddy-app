import { MaintenanceLog, MaintenanceLogResponse } from "../types/maintenance";
import client from "./client";

export async function fetchMotorcycleMaintenanceLogs(
  motorcycleId: number,
): Promise<MaintenanceLog[]> {
  const response = await client.get<MaintenanceLogResponse>(
    "/maintenance-logs",
    {
      params: {
        user_motorcycle_id: motorcycleId,
      },
    },
  );

  return response.data.data;
}
