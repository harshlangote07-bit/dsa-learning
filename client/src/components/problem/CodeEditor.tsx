import Editor from "@monaco-editor/react";
import { useState } from "react";
import { runCode } from "../../services/compiler.api";

import EditorToolbar from "./EditorToolbar";
import OutputConsole from "./OutputConsole";

const starterTemplates = {
  cpp: `#include <iostream>
using namespace std;

int main() {

    cout << "Hello World";

    return 0;
}`,

  java: `public class Main {

    public static void main(String[] args) {

        System.out.println("Hello World");

    }

}`,

  python: `print("Hello World")`,
};

export default function CodeEditor() {
  const [language, setLanguage] = useState("cpp");

  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const [code, setCode] = useState(
    starterTemplates.cpp
  );

  const [output, setOutput] = useState("");

  function handleLanguageChange(newLanguage: string) {
    setLanguage(newLanguage);

    setCode(
      starterTemplates[
        newLanguage as keyof typeof starterTemplates
      ]
    );

    setOutput("");
  }

async function handleRun() {
  setRunning(true);
  setOutput("Running...");

  try {
    const result = await runCode({
      language,
      code,
      input,
    });

    if (result.success) {
      setOutput(result.output || "Program finished.");
    } else {
      setOutput(result.error);
    }
  } catch {
    setOutput("Failed to connect to compiler.");
  } finally {
    setRunning(false);
  }
}

  function handleSubmit() {
    alert(
      "Submit functionality will be connected to the Online Judge."
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">

      <EditorToolbar
        language={language}
        onLanguageChange={handleLanguageChange}
        onRun={handleRun}
        onSubmit={handleSubmit}
        running={running}
      />

      <Editor
        height="500px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          fontSize: 15,
          fontLigatures: true,
          minimap: {
            enabled: false,
          },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: {
            top: 20,
          },
        }}
      />

         <div className="border-t border-slate-800 bg-slate-900 p-4">

      <h2 className="mb-2 text-sm font-semibold text-slate-400">
        Custom Input
      </h2>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter custom input..."
        className="h-28 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-sm text-white outline-none"
      />

    </div>

      <OutputConsole output={output} />

    </div>
  );
}