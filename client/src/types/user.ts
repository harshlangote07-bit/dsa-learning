export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;

  stats: {
    problemsSolved: number;
    totalSubmissions: number;
    acceptedSubmissions: number;
    acceptanceRate: number;
  };
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
}