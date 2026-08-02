import api from "./api";

import type { DashboardResponse } from "../types/dashboard";

export async function getDashboard(): Promise<DashboardResponse> {
  const response = await api.get("/dashboard");

  return response.data;
}