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


export interface ProblemProgress {
  attempted: boolean;
  solved: boolean;
  totalSubmissions: number;
  acceptedSubmissions: number;
  latestVerdict:
    | "AC"
    | "WA"
    | "TLE"
    | "MLE"
    | "RE"
    | "CE"
    | null;
  latestSubmissionNumber: number | null;
  lastSubmittedAt: string | null;
}