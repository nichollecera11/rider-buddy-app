import { useQuery } from "@tanstack/react-query";
import { fetchMotorcycles } from "../api/motorcycles";

export function useMotorcycles() {
  return useQuery({ queryKey: ["motorcycles"], queryFn: fetchMotorcycles });
}
