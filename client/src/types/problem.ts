export interface ProblemTopic {
  problemId: string;
  topicId: string;
  weight: number;

  topic: {
    id: string;
    name: string;
  };
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXTREME";
  createdAt: string;
  updatedAt: string;
  topics: ProblemTopic[];
}

export interface ProblemsResponse {
  success: boolean;
  message: string;
  data: Problem[];
}