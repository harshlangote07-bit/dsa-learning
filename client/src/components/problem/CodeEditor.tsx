import Editor from "@monaco-editor/react";
import { useState } from "react";

import { runCode } from "../../services/compiler.api";
import { createSubmission } from "../../services/submission.api";

import EditorToolbar from "./EditorToolbar";
import OutputConsole from "./OutputConsole";

interface CodeEditorProps {
  problemId: string;
  onSubmissionComplete: () => void;
}

const starterCode = `#include <iostream>
using namespace std;

int main() {

    cout << "Hello World";

    return 0;
}`;

export default function CodeEditor({
  problemId,
  onSubmissionComplete,
}: CodeEditorProps) {
  const [language] = useState("cpp");

  const [input, setInput] = useState("");

  const [running, setRunning] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [code, setCode] =
    useState(starterCode);

  const [output, setOutput] =
    useState("");

  const [submissionResult, setSubmissionResult] =
    useState("");

  async function handleRun() {
    setRunning(true);
    setOutput("Running...");
    setSubmissionResult("");

    try {
      const result = await runCode({
        language,
        code,
        input,
      });

      if (result.success) {
        setOutput(
          result.output || "Program finished."
        );
      } else {
        setOutput(result.error);
      }
    } catch {
      setOutput(
        "Failed to connect to compiler."
      );
    } finally {
      setRunning(false);
    }
  }

  async function handleSubmit() {
    if (!code.trim()) {
      setSubmissionResult(
        "Code cannot be empty."
      );
      return;
    }

    setSubmitting(true);
    setSubmissionResult("Submitting...");
    setOutput("");

    try {
      const result =
        await createSubmission({
          problemId,
          language: "CPP",
          code,
        });

      const { judge } = result.data;

      setSubmissionResult(
        `${judge.verdict} — ${judge.passedTests}/${judge.totalTests} tests passed`
      );

      onSubmissionComplete();
    } catch (err: any) {
      setSubmissionResult(
        err.response?.data?.message ??
          "Submission failed."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">

      {/* ========================= */}
      {/* TOOLBAR */}
      {/* ========================= */}

      <div className="shrink-0">
        <EditorToolbar
          language={language}
          onLanguageChange={() => {}}
          onRun={handleRun}
          onSubmit={handleSubmit}
          running={running}
          submitting={submitting}
        />
      </div>

      {/* ========================= */}
      {/* CODE EDITOR */}
      {/* ========================= */}

      <div className="min-h-[280px] flex-1 overflow-hidden">

        <Editor
          height="100%"
          language="cpp"
          theme="vs-dark"
          value={code}
          onChange={(value) =>
            setCode(value || "")
          }
          options={{
            fontSize: 15,
            fontLigatures: true,

            minimap: {
              enabled: false,
            },

            automaticLayout: true,

            scrollBeyondLastLine: false,

            padding: {
              top: 16,
              bottom: 16,
            },

            wordWrap: "on",

            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
        />

      </div>

      {/* ========================= */}
      {/* CUSTOM INPUT */}
      {/* ========================= */}

      <div className="h-32 shrink-0 border-t border-slate-800 bg-slate-900 p-4">

        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Custom Input
        </h2>

        <textarea
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          placeholder="Enter custom input..."
          className="h-20 w-full resize-none overflow-y-auto rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-sm text-white outline-none transition focus:border-blue-500"
        />

      </div>

      {/* ========================= */}
      {/* SUBMISSION RESULT */}
      {/* ========================= */}

      {submissionResult && (
        <div className="max-h-24 shrink-0 overflow-y-auto border-t border-slate-800 bg-slate-950 px-4 py-3">

          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Submission Result
          </p>

          <p className="mt-1 font-mono text-sm text-blue-400">
            {submissionResult}
          </p>

        </div>
      )}

      {/* ========================= */}
      {/* OUTPUT */}
      {/* ========================= */}

      <div className="h-44 shrink-0 overflow-hidden">
        <OutputConsole output={output} />
      </div>

    </div>
  );
}