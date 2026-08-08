import api from "./api";

export interface RunCodeRequest {
  language: string;
  code: string;
  input: string;
}

export interface RunCodeResponse {
  success: boolean;
  output: string;
  error: string;
}

export async function runCode(
  data: RunCodeRequest
): Promise<RunCodeResponse> {
  const response = await api.post(
    "/compiler/run",
    data
  );

  return response.data;
}