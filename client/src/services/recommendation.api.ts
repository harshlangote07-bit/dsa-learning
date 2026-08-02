import api from "./api";

import type {
  RecommendationResponse,
} from "../types/recommendation";

export async function getRecommendations(): Promise<RecommendationResponse> {
  const response = await api.get("/recommendations");

  return response.data;
}