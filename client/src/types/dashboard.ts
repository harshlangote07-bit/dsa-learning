export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  problemsSolved: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  acceptanceRate: number;
}

export interface Mastery {
  userId: string;
  topicId: string;
  mastery: number;

  topic: {
    id: string;
    name: string;
  };
}

export interface RecentSubmission {
  id: string;
  verdict: string;
  submissionNumber: number;
  submittedAt: string;

  problem: {
    id: string;
    title: string;
    difficulty: string;
  };
}

export interface DashboardResponse {
  success: boolean;

  data: {
    user: DashboardUser;

    stats: DashboardStats;

    mastery: Mastery[];

    recentSubmissions: RecentSubmission[];
  };
}