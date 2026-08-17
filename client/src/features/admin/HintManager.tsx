import { useEffect, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import {
  getHints,
  createHint,
  updateHint,
  deleteHint,
} from "../../services/hint.api";

import type { Hint } from "../../types/hint";

interface HintManagerProps {
  problemId: string;
}

export default function HintManager({
  problemId,
}: HintManagerProps) {
  const [hints, setHints] = useState<Hint[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingHint, setEditingHint] =
    useState<Hint | null>(null);

  async function fetchHints() {
    try {
      setLoading(true);
      setError("");

      const response = await getHints(problemId);

      setHints(response.data);
    } catch {
      setError("Failed to load hints.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHints();
  }, [problemId]);

  function handleCreate() {
    setEditingHint(null);
    setShowForm(true);
  }

  function handleEdit(hint: Hint) {
    setEditingHint(hint);
    setShowForm(true);
  }

  async function handleDelete(hint: Hint) {
    const confirmed = window.confirm(
      `Delete Hint ${hint.order}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteHint(
        problemId,
        hint.id
      );

      setHints((current) =>
        current.filter(
          (item) => item.id !== hint.id
        )
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
          "Failed to delete hint."
      );
    }
  }

  async function handleSave(
    content: string,
    order: number
  ) {
    try {
      setError("");

      if (editingHint) {
        await updateHint(
          problemId,
          editingHint.id,
          {
            content,
            order,
          }
        );
      } else {
        await createHint(
          problemId,
          {
            content,
            order,
          }
        );
      }

      setShowForm(false);
      setEditingHint(null);

      await fetchHints();
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ??
          "Failed to save hint."
      );
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-slate-400">
          Loading hints...
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
            Hints
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Manage the hints available for this problem.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={17} />
          Add Hint
        </button>

      </div>

      {/* Error */}

      {error && (
        <div className="mx-6 mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Empty */}

      {hints.length === 0 ? (
        <div className="p-10 text-center">

          <p className="text-slate-400">
            No hints found.
          </p>

          <button
            onClick={handleCreate}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Create First Hint
          </button>

        </div>
      ) : (
        <div className="divide-y divide-slate-800">

          {hints.map((hint) => (
            <div
              key={hint.id}
              className="p-5 transition hover:bg-slate-800/30"
            >

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="min-w-0 flex-1">

                  <span className="inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400">
                    Hint {hint.order}
                  </span>

                  <p className="mt-3 whitespace-pre-wrap text-slate-300">
                    {hint.content}
                  </p>

                </div>

                <div className="flex shrink-0 gap-2">

                  <button
                    onClick={() =>
                      handleEdit(hint)
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(hint)
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

      {/* Form */}

      {showForm && (
        <HintForm
          hint={editingHint}
          onCancel={() => {
            setShowForm(false);
            setEditingHint(null);
          }}
          onSave={handleSave}
        />
      )}

    </div>
  );
}

/* =====================================================
   Hint Form
===================================================== */

interface HintFormProps {
  hint: Hint | null;

  onCancel: () => void;

  onSave: (
    content: string,
    order: number
  ) => Promise<void>;
}

function HintForm({
  hint,
  onCancel,
  onSave,
}: HintFormProps) {
  const [content, setContent] =
    useState("");

  const [order, setOrder] =
    useState(1);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (hint) {
      setContent(hint.content);
      setOrder(hint.order);
    } else {
      setContent("");
      setOrder(1);
    }
  }, [hint]);

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError("");

    if (!content.trim()) {
      setError(
        "Hint content is required."
      );
      return;
    }

    if (order < 1) {
      setError(
        "Hint order must be at least 1."
      );
      return;
    }

    try {
      setSaving(true);

      await onSave(
        content.trim(),
        order
      );
    } catch (err: any) {
      setError(
        err.message ??
          "Failed to save hint."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">

          <div>
            <h2 className="text-2xl font-bold text-white">
              {hint
                ? "Edit Hint"
                : "Add Hint"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Configure the hint content and order.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={21} />
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Content */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Hint Content
            </label>

            <textarea
              value={content}
              onChange={(event) =>
                setContent(
                  event.target.value
                )
              }
              placeholder="Enter the hint..."
              className="min-h-36 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-7 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Order */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Order
            </label>

            <input
              type="number"
              min={1}
              step={1}
              value={order}
              onChange={(event) =>
                setOrder(
                  Number(event.target.value)
                )
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <p className="mt-2 text-xs text-slate-500">
              Each hint for a problem must have a unique order.
            </p>
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
                : hint
                ? "Update Hint"
                : "Create Hint"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}