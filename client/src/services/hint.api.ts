import api from "./api";

import type {
  HintsResponse,
  ViewHintResponse,
} from "../types/hint";

export interface CreateHintRequest {
  content: string;
  order: number;
}

export interface HintResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    content: string;
    order: number;
    createdAt?: string;
    updatedAt?: string;
  };
}

export async function getHints(
  problemId: string
): Promise<HintsResponse> {
  const response = await api.get(
    `/problems/${problemId}/hints`
  );

  return response.data;
}

export async function viewHint(
  problemId: string,
  hintId: string
): Promise<ViewHintResponse> {
  const response = await api.post(
    `/problems/${problemId}/hints/${hintId}/view`
  );

  return response.data;
}

export async function createHint(
  problemId: string,
  data: CreateHintRequest
): Promise<HintResponse> {
  const response = await api.post(
    `/problems/${problemId}/hints`,
    data
  );

  return response.data;
}

export async function updateHint(
  problemId: string,
  hintId: string,
  data: Partial<CreateHintRequest>
): Promise<HintResponse> {
  const response = await api.put(
    `/problems/${problemId}/hints/${hintId}`,
    data
  );

  return response.data;
}

export async function deleteHint(
  problemId: string,
  hintId: string
): Promise<{
  success: boolean;
  message: string;
}> {
  const response = await api.delete(
    `/problems/${problemId}/hints/${hintId}`
  );

  return response.data;
}