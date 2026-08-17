import { useEffect, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
} from "lucide-react";

import {
  getTestCases,
  createTestCase,
  updateTestCase,
  deleteTestCase,
} from "../../services/testcase.api";

import type {
  TestCase,
  CreateTestCaseRequest,
} from "../../services/testcase.api";

interface TestCaseManagerProps {
  problemId: string;
}

export default function TestCaseManager({
  problemId,
}: TestCaseManagerProps) {
  const [testCases, setTestCases] =
    useState<TestCase[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingTestCase, setEditingTestCase] =
    useState<TestCase | null>(null);

  async function fetchTestCases() {
    try {
      setLoading(true);
      setError("");

      const response =
        await getTestCases(problemId);

      setTestCases(response.data);
    } catch {
      setError(
        "Failed to load test cases."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTestCases();
  }, [problemId]);

  function handleCreate() {
    setEditingTestCase(null);
    setShowForm(true);
  }

  function handleEdit(testCase: TestCase) {
    setEditingTestCase(testCase);
    setShowForm(true);
  }

  async function handleDelete(
    testCase: TestCase
  ) {
    const confirmed =
      window.confirm(
        `Delete test case #${testCase.order}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteTestCase(
        problemId,
        testCase.id
      );

      setTestCases((current) =>
        current.filter(
          (item) =>
            item.id !== testCase.id
        )
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
          "Failed to delete test case."
      );
    }
  }

  async function handleSave(
    data: CreateTestCaseRequest
  ) {
    if (editingTestCase) {
      await updateTestCase(
        problemId,
        editingTestCase.id,
        data
      );
    } else {
      await createTestCase(
        problemId,
        data
      );
    }

    setShowForm(false);
    setEditingTestCase(null);

    await fetchTestCases();
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-slate-400">
          Loading test cases...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">

        <div>
          <h2 className="text-xl font-bold text-white">
            Test Cases
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Manage the test cases used by the judge.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={17} />
          Add Test Case
        </button>

      </div>

      {/* Error */}

      {error && (
        <div className="mx-6 mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Empty state */}

      {testCases.length === 0 ? (
        <div className="p-10 text-center">

          <p className="text-slate-400">
            No test cases found.
          </p>

          <button
            onClick={handleCreate}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Create First Test Case
          </button>

        </div>
      ) : (
        <div className="divide-y divide-slate-800">

          {testCases.map((testCase) => (
            <div
              key={testCase.id}
              className="p-5 transition hover:bg-slate-800/30"
            >

              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                {/* Information */}

                <div className="min-w-0 flex-1">

                  <div className="mb-3 flex flex-wrap items-center gap-3">

                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                      Test Case #{testCase.order}
                    </span>

                    {testCase.isHidden ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                        <EyeOff size={14} />
                        Hidden
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                        <Eye size={14} />
                        Public
                      </span>
                    )}

                  </div>

                  <div className="grid gap-4 md:grid-cols-2">

                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Input
                      </p>

                      <pre className="max-h-32 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-sm whitespace-pre-wrap text-slate-300">
                        {testCase.input ||
                          "(empty)"}
                      </pre>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Expected Output
                      </p>

                      <pre className="max-h-32 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-sm whitespace-pre-wrap text-green-400">
                        {testCase.expectedOutput ||
                          "(empty)"}
                      </pre>
                    </div>

                  </div>

                </div>

                {/* Actions */}

                <div className="flex shrink-0 gap-2">

                  <button
                    onClick={() =>
                      handleEdit(testCase)
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(testCase)
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* Form Modal */}

      {showForm && (
        <TestCaseForm
          testCase={editingTestCase}
          onCancel={() => {
            setShowForm(false);
            setEditingTestCase(null);
          }}
          onSave={handleSave}
        />
      )}

    </div>
  );
}

/* =====================================================
   Test Case Form
===================================================== */

interface TestCaseFormProps {
  testCase: TestCase | null;
  onCancel: () => void;
  onSave: (
    data: CreateTestCaseRequest
  ) => Promise<void>;
}

function TestCaseForm({
  testCase,
  onCancel,
  onSave,
}: TestCaseFormProps) {
  const [input, setInput] =
    useState("");

  const [expectedOutput, setExpectedOutput] =
    useState("");

  const [isHidden, setIsHidden] =
    useState(false);

  const [order, setOrder] =
    useState(1);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (testCase) {
      setInput(testCase.input);
      setExpectedOutput(
        testCase.expectedOutput
      );
      setIsHidden(testCase.isHidden);
      setOrder(testCase.order);
    } else {
      setInput("");
      setExpectedOutput("");
      setIsHidden(false);
      setOrder(1);
    }
  }, [testCase]);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");

    if (order < 1) {
      setError(
        "Order must be at least 1."
      );
      return;
    }

    try {
      setSaving(true);

      await onSave({
        input,
        expectedOutput,
        isHidden,
        order,
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
          "Failed to save test case."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">

          <div>
            <h2 className="text-2xl font-bold text-white">
              {testCase
                ? "Edit Test Case"
                : "Add Test Case"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Configure the input and expected output.
            </p>
          </div>

          <button
            onClick={onCancel}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={21} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Input */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Input
            </label>

            <textarea
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Enter test case input..."
              className="min-h-32 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Expected Output */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Expected Output
            </label>

            <textarea
              value={expectedOutput}
              onChange={(e) =>
                setExpectedOutput(
                  e.target.value
                )
              }
              placeholder="Enter expected output..."
              className="min-h-32 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Order + Hidden */}

          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Order
              </label>

              <input
                type="number"
                min={1}
                step={1}
                value={order}
                onChange={(e) =>
                  setOrder(
                    Number(e.target.value)
                  )
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">

              <input
                type="checkbox"
                checked={isHidden}
                onChange={(e) =>
                  setIsHidden(
                    e.target.checked
                  )
                }
                className="h-5 w-5 accent-blue-600"
              />

              <div>
                <p className="font-medium text-white">
                  Hidden Test Case
                </p>

                <p className="text-xs text-slate-500">
                  Keep this test case hidden from users.
                </p>
              </div>

            </label>

          </div>

          {/* Actions */}

          <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">

            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : testCase
                ? "Update Test Case"
                : "Create Test Case"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}