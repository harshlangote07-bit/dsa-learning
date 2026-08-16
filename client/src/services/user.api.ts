import api from "./api";

export async function getMe() {
  const response = await api.get("/users/me");

  return response.data;
}

export async function getProfile() {
  const response = await api.get("/users/me");

  return response.data;
}