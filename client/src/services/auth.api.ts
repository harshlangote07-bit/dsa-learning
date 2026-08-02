import api from "./api";
import type { LoginResponse } from "../types/auth";
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export async function login(
  data: LoginRequest
): Promise<LoginResponse> {
  const response = await api.post("/auth/login", data);
  return response.data;
}

export async function register(data: RegisterRequest) {
  const response = await api.post("/auth/register", data);
  return response.data;
}