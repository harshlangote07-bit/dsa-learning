import api from "./api";

export interface TestCase {
  id: string;
  problemId: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestCasesResponse {
  success: boolean;
  data: TestCase[];
}

export interface TestCaseResponse {
  success: boolean;
  message: string;
  data: TestCase;
}

export interface CreateTestCaseRequest {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  order: number;
}

export async function getTestCases(
  problemId: string
): Promise<TestCasesResponse> {
  const response = await api.get(
    `/problems/${problemId}/testcases`
  );

  return response.data;
}

export async function createTestCase(
  problemId: string,
  data: CreateTestCaseRequest
): Promise<TestCaseResponse> {
  const response = await api.post(
    `/problems/${problemId}/testcases`,
    data
  );

  return response.data;
}

export async function updateTestCase(
  problemId: string,
  testcaseId: string,
  data: Partial<CreateTestCaseRequest>
): Promise<TestCaseResponse> {
  const response = await api.put(
    `/problems/${problemId}/testcases/${testcaseId}`,
    data
  );

  return response.data;
}

export async function deleteTestCase(
  problemId: string,
  testcaseId: string
): Promise<{
  success: boolean;
  message: string;
}> {
  const response = await api.delete(
    `/problems/${problemId}/testcases/${testcaseId}`
  );

  return response.data;
}