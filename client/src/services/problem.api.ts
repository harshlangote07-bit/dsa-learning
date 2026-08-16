import api from "./api";

import type {
  Problem,
  ProblemsResponse,
  ProblemProgress,
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

export interface ProblemProgressResponse {
  success: boolean;
  data: ProblemProgress;
}

export async function getProblemProgress(
  id: string
): Promise<ProblemProgressResponse> {
  const response = await api.get(
    `/problems/${id}/progress`
  );

  return response.data;
}