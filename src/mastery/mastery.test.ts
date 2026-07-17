import { updateMastery } from "./mastery.engine";
import {
  Difficulty,
  MasteryState,
  Verdict,
  LearningEvidence,
} from "./mastery.types";

interface TestCase {
  name: string;
  state: MasteryState;
  evidence: LearningEvidence;
}

const tests: TestCase[] = [
  {
    name: "Test 1 - Medium | First Attempt | No Hints",
    state: { topicId: "arrays", mastery: 50 },
    evidence: {
      topicId: "arrays",
      problemId: "two-sum",
      verdict: Verdict.AC,
      difficulty: Difficulty.MEDIUM,
      attemptNumber: 1,
      timestamp: new Date(),
      hintsUsed: 0,
    },
  },

  {
    name: "Test 2 - Easy | First Attempt",
    state: { topicId: "arrays", mastery: 20 },
    evidence: {
      topicId: "arrays",
      problemId: "binary-search",
      verdict: Verdict.AC,
      difficulty: Difficulty.EASY,
      attemptNumber: 1,
      timestamp: new Date(),
      hintsUsed: 0,
    },
  },

  {
    name: "Test 3 - Hard | First Attempt",
    state: { topicId: "graphs", mastery: 40 },
    evidence: {
      topicId: "graphs",
      problemId: "dijkstra",
      verdict: Verdict.AC,
      difficulty: Difficulty.HARD,
      attemptNumber: 1,
      timestamp: new Date(),
      hintsUsed: 0,
    },
  },

  {
    name: "Test 4 - Extreme | First Attempt",
    state: { topicId: "dp", mastery: 30 },
    evidence: {
      topicId: "dp",
      problemId: "digit-dp",
      verdict: Verdict.AC,
      difficulty: Difficulty.EXTREME,
      attemptNumber: 1,
      timestamp: new Date(),
      hintsUsed: 0,
    },
  },

  {
    name: "Test 5 - Hard | Second Attempt",
    state: { topicId: "trees", mastery: 50 },
    evidence: {
      topicId: "trees",
      problemId: "lca",
      verdict: Verdict.AC,
      difficulty: Difficulty.HARD,
      attemptNumber: 2,
      timestamp: new Date(),
      hintsUsed: 0,
    },
  },

  {
    name: "Test 6 - Hard | Third Attempt",
    state: { topicId: "trees", mastery: 50 },
    evidence: {
      topicId: "trees",
      problemId: "segment-tree",
      verdict: Verdict.AC,
      difficulty: Difficulty.HARD,
      attemptNumber: 3,
      timestamp: new Date(),
      hintsUsed: 0,
    },
  },

  {
    name: "Test 7 - Hard | Fourth Attempt",
    state: { topicId: "trees", mastery: 50 },
    evidence: {
      topicId: "trees",
      problemId: "heavy-light",
      verdict: Verdict.AC,
      difficulty: Difficulty.HARD,
      attemptNumber: 4,
      timestamp: new Date(),
      hintsUsed: 0,
    },
  },

  {
    name: "Test 8 - One Hint",
    state: { topicId: "arrays", mastery: 50 },
    evidence: {
      topicId: "arrays",
      problemId: "prefix-sum",
      verdict: Verdict.AC,
      difficulty: Difficulty.MEDIUM,
      attemptNumber: 1,
      timestamp: new Date(),
      hintsUsed: 1,
    },
  },

  {
    name: "Test 9 - Two Hints",
    state: { topicId: "arrays", mastery: 50 },
    evidence: {
      topicId: "arrays",
      problemId: "difference-array",
      verdict: Verdict.AC,
      difficulty: Difficulty.MEDIUM,
      attemptNumber: 1,
      timestamp: new Date(),
      hintsUsed: 2,
    },
  },

  {
    name: "Test 10 - Three Hints",
    state: { topicId: "arrays", mastery: 50 },
    evidence: {
      topicId: "arrays",
      problemId: "fenwick-tree",
      verdict: Verdict.AC,
      difficulty: Difficulty.MEDIUM,
      attemptNumber: 1,
      timestamp: new Date(),
      hintsUsed: 3,
    },
  },

  {
    name: "Test 11 - Wrong Answer",
    state: { topicId: "graphs", mastery: 60 },
    evidence: {
      topicId: "graphs",
      problemId: "mst",
      verdict: Verdict.WA,
      difficulty: Difficulty.EXTREME,
      attemptNumber: 1,
      timestamp: new Date(),
      hintsUsed: 0,
    },
  },

  {
    name: "Test 12 - TLE",
    state: { topicId: "graphs", mastery: 72 },
    evidence: {
      topicId: "graphs",
      problemId: "floyd-warshall",
      verdict: Verdict.TLE,
      difficulty: Difficulty.HARD,
      attemptNumber: 1,
      timestamp: new Date(),
      hintsUsed: 0,
    },
  },

  {
    name: "Test 13 - Near Maximum Mastery",
    state: { topicId: "dp", mastery: 99 },
    evidence: {
      topicId: "dp",
      problemId: "bitmask-dp",
      verdict: Verdict.AC,
      difficulty: Difficulty.EXTREME,
      attemptNumber: 1,
      timestamp: new Date(),
      hintsUsed: 0,
    },
  },

  {
    name: "Test 14 - Already Mastered",
    state: { topicId: "dp", mastery: 100 },
    evidence: {
      topicId: "dp",
      problemId: "convex-hull-trick",
      verdict: Verdict.AC,
      difficulty: Difficulty.EXTREME,
      attemptNumber: 1,
      timestamp: new Date(),
      hintsUsed: 0,
    },
  },

  {
    name: "Test 15 - Clamp to 100",
    state: { topicId: "dp", mastery: 99.99 },
    evidence: {
      topicId: "dp",
      problemId: "alien-trick",
      verdict: Verdict.AC,
      difficulty: Difficulty.EXTREME,
      attemptNumber: 1,
      timestamp: new Date(),
      hintsUsed: 0,
    },
  },
];

tests.forEach((test, index) => {
  console.log(`\n==============================`);
  console.log(`${index + 1}. ${test.name}`);
  console.log(`==============================`);

  const result = updateMastery(test.state, test.evidence);

  console.log(result);
});