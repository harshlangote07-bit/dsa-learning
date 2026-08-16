import api from "./api";

import type { Problem } from "../types/problem";

export interface CreateProblemRequest {
  title: string;
  slug: string;
  description: string;
  difficulty:
    | "EASY"
    | "MEDIUM"
    | "HARD"
    | "EXTREME";

  topics: {
    topicId: string;
    weight: number;
  }[];
}

export interface AdminProblemResponse {
  success: boolean;
  message: string;
  data: Problem;
}

export async function createProblem(
  data: CreateProblemRequest
): Promise<AdminProblemResponse> {
  const response =
    await api.post<AdminProblemResponse>(
      "/problems",
      data
    );

  return response.data;
}

export async function updateProblem(
  id: string,
  data: CreateProblemRequest
): Promise<AdminProblemResponse> {
  const response =
    await api.put<AdminProblemResponse>(
      `/problems/${id}`,
      data
    );

  return response.data;
}

export async function deleteProblem(
  id: string
): Promise<{
  success: boolean;
  message: string;
}> {
  const response =
    await api.delete(
      `/problems/${id}`
    );

  return response.data;
}