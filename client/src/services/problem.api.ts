import api from "./api";

import type {
  Problem,
  ProblemsResponse,
} from "../types/problem";

export interface ProblemResponse {
  success: boolean;
  message: string;
  data: Problem;
}

export async function getProblems(): Promise<ProblemsResponse> {
  const response = await api.get("/problems");
  return response.data;
}

export async function getProblemById(
  id: string
): Promise<ProblemResponse> {
  const response = await api.get(`/problems/${id}`);
  return response.data;
}