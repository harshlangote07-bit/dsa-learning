// --------------------
// Enums
// --------------------

export enum Verdict {
  AC = "AC",
  WA = "WA",
  TLE = "TLE",
  MLE = "MLE",
  RE = "RE",
}

export enum Difficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
  EXTREME = "Extreme",
}

// --------------------
// Current Mastery State
// --------------------

export interface MasteryState {
  topicId: string;
  mastery: number; // 0 - 100
}

// --------------------
// Learning Evidence
// --------------------

export interface LearningEvidence {
  topicId: string;
  problemId: string;

  verdict: Verdict;
  difficulty: Difficulty;

  attemptNumber: number;
  timestamp: Date;
  hintsUsed: number;
}

// --------------------
// Explanation
// --------------------

export interface Explanation {
  previousMastery: number;
  newMastery: number;
  delta: number;
  factors: string[];
}

// --------------------
// Engine Output
// --------------------

export interface MasteryUpdate {
  updatedState: MasteryState;
  explanation: Explanation;
}