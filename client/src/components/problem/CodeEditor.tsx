import Editor from "@monaco-editor/react";
import { useState } from "react";

export default function CodeEditor() {
const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {

    cout << "Hello World";

    return 0;
}`);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800">

      <Editor
        height="600px"
        defaultLanguage="cpp"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          fontSize: 15,
          minimap: {
            enabled: false,
          },
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
      />

    </div>
  );
}