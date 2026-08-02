import api from "./api";

import type { UserProfileResponse } from "../types/user";

export async function getProfile(): Promise<UserProfileResponse> {
  const response = await api.get("/users/me");

  return response.data;
}