import { processSubmission } from "./submission.service";
import {
  Difficulty,
  Verdict,
  LearningEvidence,
  MasteryState,
  ProblemTopic,
} from "./mastery.types";

interface TestCase {
  name: string;
  masteries: MasteryState[];
  problemTopics: ProblemTopic[];
  evidence: LearningEvidence;
}

const tests: TestCase[] = [
  {
    name: "Single Topic - Binary Search",
    masteries: [
      { topicId: "binary-search", mastery: 40 },
    ],
    problemTopics: [
      { topicId: "binary-search", weight: 1.0 },
    ],
    evidence: {
      problemId: "binary-search",
      verdict: Verdict.AC,
      difficulty: Difficulty.EASY,
      attemptNumber: 1,
      hintsUsed: 0,
      timestamp: new Date(),
    },
  },

  {
    name: "Two Topics - Rotated Sorted Array",
    masteries: [
      { topicId: "binary-search", mastery: 55 },
      { topicId: "arrays", mastery: 45 },
    ],
    problemTopics: [
      { topicId: "binary-search", weight: 0.7 },
      { topicId: "arrays", weight: 0.3 },
    ],
    evidence: {
      problemId: "rotated-array",
      verdict: Verdict.AC,
      difficulty: Difficulty.MEDIUM,
      attemptNumber: 1,
      hintsUsed: 0,
      timestamp: new Date(),
    },
  },

  {
    name: "Three Topics - Number of Islands",
    masteries: [
      { topicId: "graph", mastery: 45 },
      { topicId: "bfs", mastery: 30 },
      { topicId: "matrix", mastery: 60 },
    ],
    problemTopics: [
      { topicId: "graph", weight: 0.5 },
      { topicId: "bfs", weight: 0.3 },
      { topicId: "matrix", weight: 0.2 },
    ],
    evidence: {
      problemId: "number-of-islands",
      verdict: Verdict.AC,
      difficulty: Difficulty.HARD,
      attemptNumber: 1,
      hintsUsed: 0,
      timestamp: new Date(),
    },
  },

  {
    name: "Four Topics - Word Ladder",
    masteries: [
      { topicId: "graph", mastery: 55 },
      { topicId: "bfs", mastery: 50 },
      { topicId: "strings", mastery: 42 },
      { topicId: "hashmap", mastery: 60 },
    ],
    problemTopics: [
      { topicId: "graph", weight: 0.35 },
      { topicId: "bfs", weight: 0.30 },
      { topicId: "strings", weight: 0.20 },
      { topicId: "hashmap", weight: 0.15 },
    ],
    evidence: {
      problemId: "word-ladder",
      verdict: Verdict.AC,
      difficulty: Difficulty.HARD,
      attemptNumber: 1,
      hintsUsed: 0,
      timestamp: new Date(),
    },
  },

  {
    name: "Five Topics - Alien Dictionary",
    masteries: [
      { topicId: "graph", mastery: 50 },
      { topicId: "topological-sort", mastery: 35 },
      { topicId: "dfs", mastery: 40 },
      { topicId: "strings", mastery: 60 },
      { topicId: "hashmap", mastery: 55 },
    ],
    problemTopics: [
      { topicId: "graph", weight: 0.30 },
      { topicId: "topological-sort", weight: 0.30 },
      { topicId: "dfs", weight: 0.15 },
      { topicId: "strings", weight: 0.15 },
      { topicId: "hashmap", weight: 0.10 },
    ],
    evidence: {
      problemId: "alien-dictionary",
      verdict: Verdict.AC,
      difficulty: Difficulty.HARD,
      attemptNumber: 2,
      hintsUsed: 1,
      timestamp: new Date(),
    },
  },
];

for (const test of tests) {
  console.log("\n========================================");
  console.log(test.name);
  console.log("========================================");

  const result = processSubmission(
    test.masteries,
    test.problemTopics,
    test.evidence
  );

  console.dir(result, { depth: null });
}