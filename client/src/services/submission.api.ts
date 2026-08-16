import api from "./api";

export type Verdict =
  | "AC"
  | "WA"
  | "TLE"
  | "MLE"
  | "RE"
  | "CE";

export type Language =
  | "CPP"
  | "JAVA"
  | "PYTHON";

export interface CreateSubmissionRequest {
  problemId: string;
  language: Language;
  code: string;
}

export interface SubmissionJudge {
  verdict: Verdict;
  executionTime: number;
  passedTests: number;
  totalTests: number;
}

export interface Submission {
  id: string;
  language: Language;
  code?: string;
  executionTime: number;
  verdict: Verdict;
  submissionNumber: number;
  score: number;
  hintsViewed: number;
  submittedAt: string;

  problem: {
    id: string;
    title: string;
    slug?: string;
    difficulty:
      | "EASY"
      | "MEDIUM"
      | "HARD"
      | "EXTREME";
  };
}

export interface CreateSubmissionResponse {
  success: boolean;
  message: string;

  data: {
    submission: Submission;

    judge: SubmissionJudge;
  };
}

export interface SubmissionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SubmissionsResponse {
  success: boolean;

  data: Submission[];

  pagination: SubmissionPagination;
}

export async function createSubmission(
  data: CreateSubmissionRequest
): Promise<CreateSubmissionResponse> {
  const response =
    await api.post<CreateSubmissionResponse>(
      "/submissions",
      data
    );

  return response.data;
}

export async function getSubmissions(
  page = 1,
  limit = 10
): Promise<SubmissionsResponse> {
  const response =
    await api.get<SubmissionsResponse>(
      "/submissions",
      {
        params: {
          page,
          limit,
        },
      }
    );

  return response.data;
}

export async function getSubmissionById(
  id: string
): Promise<{
  success: boolean;
  data: Submission;
}> {
  const response =
    await api.get(
      `/submissions/${id}`
    );

  return response.data;
}