import fs from "fs/promises";
import path from "path";
import { spawn } from "child_process";
import { performance } from "perf_hooks";
import { v4 as uuid } from "uuid";

interface RunResult {
  success: boolean;
  type:
    | "SUCCESS"
    | "COMPILATION_ERROR"
    | "RUNTIME_ERROR"
    | "TIME_LIMIT_EXCEEDED";
  output: string;
  error: string;
  executionTime: number;
  memory: number;
}

export async function runCpp(
  code: string,
  input = ""
): Promise<RunResult> {
  const id = uuid();

  const tempDir = path.join(process.cwd(), "temp");

  await fs.mkdir(tempDir, {
    recursive: true,
  });

  const sourceFile = path.join(tempDir, `${id}.cpp`);
  const executableFile = path.join(tempDir, `${id}.exe`);

  await fs.writeFile(sourceFile, code);

  try {
    // ==========================
    // Compile
    // ==========================

    await new Promise<void>((resolve, reject) => {
      const compiler = spawn("g++", [
        sourceFile,
        "-o",
        executableFile,
      ]);

      let compileError = "";

      compiler.stderr.on("data", (data) => {
        compileError += data.toString();
      });

      compiler.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(compileError));
        }
      });
    });

    // ==========================
    // Execute
    // ==========================

    const result = await new Promise<RunResult>((resolve) => {
      const start = performance.now();

      const program = spawn(executableFile);

      let stdout = "";
      let stderr = "";

      let timedOut = false;

      const timeout = setTimeout(() => {
        timedOut = true;
        program.kill();
      }, 2000);

      program.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      program.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      if (input) {
        program.stdin.write(input);
      }

      program.stdin.end();

      program.on("close", (code) => {
        clearTimeout(timeout);

        const executionTime = Math.round(
          performance.now() - start
        );

        // Time Limit Exceeded
        if (timedOut) {
          resolve({
            success: false,
            type: "TIME_LIMIT_EXCEEDED",
            output: "",
            error: "Execution exceeded 2 seconds.",
            executionTime,
            memory: 0,
          });

          return;
        }

        // Runtime Error
        if (code !== 0) {
          resolve({
            success: false,
            type: "RUNTIME_ERROR",
            output: stdout,
            error: stderr || "Runtime Error",
            executionTime,
            memory: 0,
          });

          return;
        }

        // Success
        resolve({
          success: true,
          type: "SUCCESS",
          output: stdout,
          error: "",
          executionTime,
          memory: 0,
        });
      });
    });

    return result;
  } catch (error: any) {
    return {
      success: false,
      type: "COMPILATION_ERROR",
      output: "",
      error: error.message || "Compilation Failed",
      executionTime: 0,
      memory: 0,
    };
  } finally {
    await fs.unlink(sourceFile).catch(() => {});
    await fs.unlink(executableFile).catch(() => {});
  }
}