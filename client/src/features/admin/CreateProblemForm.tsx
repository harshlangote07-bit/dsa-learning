import { useEffect, useState } from "react";

import { X, Plus, Trash2 } from "lucide-react";

import {
  createProblem,
  updateProblem,
  type CreateProblemRequest,
} from "../../services/admin.api";

import type { Problem } from "../../types/problem";

import api from "../../services/api";

interface Topic {
  id: string;
  name: string;
}

interface CreateProblemFormProps {
  onCreated: () => void;
  onCancel: () => void;

  problem?: Problem;
}

export default function CreateProblemForm({
  onCreated,
  onCancel,
  problem,
}: CreateProblemFormProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] =
    useState("");

  const [difficulty, setDifficulty] =
    useState<CreateProblemRequest["difficulty"]>(
      "EASY"
    );

  const [topics, setTopics] =
    useState<Topic[]>([]);

  const [selectedTopics, setSelectedTopics] =
    useState<
      {
        topicId: string;
        weight: number;
      }[]
    >([]);

  const [loadingTopics, setLoadingTopics] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!problem) {
        return;
    }

    setTitle(problem.title);
    setSlug(
    problem.slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    );
    setDescription(problem.description);
    setDifficulty(problem.difficulty);

    setSelectedTopics(
        problem.topics.map((topic) => ({
        topicId: topic.topicId,
        weight: topic.weight,
        }))
    );
    }, [problem]);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const response =
          await api.get("/topics");

        setTopics(response.data.data);
      } catch {
        setError(
          "Failed to load topics."
        );
      } finally {
        setLoadingTopics(false);
      }
    }

    fetchTopics();
  }, []);

  function addTopic() {
    if (topics.length === 0) {
      return;
    }

    const availableTopic =
      topics.find(
        (topic) =>
          !selectedTopics.some(
            (selected) =>
              selected.topicId === topic.id
          )
      );

    if (!availableTopic) {
      return;
    }

    setSelectedTopics((current) => [
      ...current,
      {
        topicId: availableTopic.id,
        weight: 1,
      },
    ]);
  }

  function removeTopic(
    topicId: string
  ) {
    setSelectedTopics((current) =>
      current.filter(
        (topic) =>
          topic.topicId !== topicId
      )
    );
  }

  function updateTopicWeight(
    topicId: string,
    weight: number
  ) {
    setSelectedTopics((current) =>
      current.map((topic) =>
        topic.topicId === topicId
          ? {
              ...topic,
              weight,
            }
          : topic
      )
    );
  }

  function handleTitleChange(
    value: string
  ) {
    setTitle(value);

    if (!slug) {
      setSlug(
        value
          .toLowerCase()
          .trim()
          .replace(
            /[^a-z0-9]+/g,
            "-"
          )
          .replace(
            /^-+|-+$/g,
            ""
          )
      );
    }
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");

    if (selectedTopics.length === 0) {
      setError(
        "At least one topic is required."
      );
      return;
    }

    const data: CreateProblemRequest = {
      title: title.trim(),
      slug: slug.trim(),
      description:
        description.trim(),
      difficulty,
      topics: selectedTopics,
    };

    try {
      setSubmitting(true);

    if (problem) {
        await updateProblem(
            problem.id,
            data
        );
    } else {
        await createProblem(data);
        }

        onCreated();
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
          "Failed to create problem."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">

          <div>
           <h2 className="text-2xl font-bold text-white">
                {problem
                    ? "Edit Problem"
                    : "Create Problem"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Add a new DSA problem.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={22} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

          {/* Error */}

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Title */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                handleTitleChange(
                  e.target.value
                )
              }
              placeholder="Valid Anagram"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              required
              minLength={3}
              maxLength={200}
            />
          </div>

          {/* Slug */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Slug
            </label>

            <input
              value={slug}
              onChange={(e) =>
                setSlug(
                  e.target.value
                )
              }
              placeholder="valid-anagram"
              pattern="[a-z0-9-]+"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              required
            />

            <p className="mt-1 text-xs text-slate-500">
              Lowercase letters, numbers and
              hyphens only.
            </p>
          </div>

          {/* Difficulty */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Difficulty
            </label>

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target
                    .value as CreateProblemRequest["difficulty"]
                )
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              <option value="EASY">
                EASY
              </option>

              <option value="MEDIUM">
                MEDIUM
              </option>

              <option value="HARD">
                HARD
              </option>

              <option value="EXTREME">
                EXTREME
              </option>
            </select>
          </div>

          {/* Description */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Describe the problem..."
              className="min-h-40 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              required
              minLength={10}
              maxLength={5000}
            />
          </div>

          {/* Topics */}

          <div>

            <div className="mb-3 flex items-center justify-between">

              <div>
                <label className="text-sm font-medium text-slate-300">
                  Topics
                </label>

                <p className="mt-1 text-xs text-slate-500">
                  Add at least one topic and assign
                  its weight.
                </p>
              </div>

              <button
                type="button"
                onClick={addTopic}
                disabled={
                  loadingTopics ||
                  selectedTopics.length >=
                    topics.length
                }
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={16} />
                Add Topic
              </button>

            </div>

            {loadingTopics ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-400">
                Loading topics...
              </div>
            ) : selectedTopics.length ===
              0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center text-sm text-slate-500">
                No topics selected.
              </div>
            ) : (
              <div className="space-y-3">

                {selectedTopics.map(
                  (selected) => {
                    const topic =
                      topics.find(
                        (item) =>
                          item.id ===
                          selected.topicId
                      );

                    return (
                      <div
                        key={
                          selected.topicId
                        }
                        className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center"
                      >

                        <select
                          value={
                            selected.topicId
                          }
                          onChange={(e) => {
                            const newId =
                              e.target.value;

                            setSelectedTopics(
                              (current) =>
                                current.map(
                                  (item) =>
                                    item.topicId ===
                                    selected.topicId
                                      ? {
                                          ...item,
                                          topicId:
                                            newId,
                                        }
                                      : item
                                )
                            );
                          }}
                          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-blue-500"
                        >
                          {topics.map(
                            (item) => (
                              <option
                                key={
                                  item.id
                                }
                                value={
                                  item.id
                                }
                              >
                                {item.name}
                              </option>
                            )
                          )}
                        </select>

                        <div className="flex items-center gap-2">

                          <input
                            type="number"
                            min={0}
                            max={1}
                            step={0.1}
                            value={
                              selected.weight
                            }
                            onChange={(e) =>
                              updateTopicWeight(
                                selected.topicId,
                                Number(
                                  e.target.value
                                )
                              )
                            }
                            className="w-24 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-blue-500"
                          />

                          <span className="text-sm text-slate-500">
                            Weight
                          </span>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeTopic(
                              selected.topicId
                            )
                          }
                          className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>

          {/* Actions */}

          <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">

            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
            >
              Cancel
            </button>

           <button
            type="submit"
            disabled={
                submitting ||
                loadingTopics
            }
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
            {submitting
                ? "Saving..."
                : problem
                ? "Update Problem"
                : "Create Problem"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}