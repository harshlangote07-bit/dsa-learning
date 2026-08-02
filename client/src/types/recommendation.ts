export interface Recommendation {
  problemId: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXTREME";
  score: number;
  reason: string;
}

export interface RecommendationResponse {
  success: boolean;
  count: number;
  data: Recommendation[];
}