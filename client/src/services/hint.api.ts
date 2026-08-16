import api from "./api";

import type {
  HintsResponse,
  ViewHintResponse,
} from "../types/hint";

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