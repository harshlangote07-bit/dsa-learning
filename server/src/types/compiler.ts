export type CompilerResultType =
  | "SUCCESS"
  | "COMPILATION_ERROR"
  | "RUNTIME_ERROR"
  | "TIME_LIMIT_EXCEEDED";

export interface CompilerResult {
  success: boolean;

  type: CompilerResultType;

  output: string;

  error: string;

  executionTime: number;

  memory: number;
}