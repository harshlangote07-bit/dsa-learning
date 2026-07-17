import {
  Difficulty,
  Explanation,
  LearningEvidence,
  MasteryState,
  MasteryUpdate,
  Verdict,
} from "./mastery.types";

/**
 * Returns the base score associated with a problem difficulty.
 */

const DIFFICULTY_SCORE = {
  [Difficulty.EASY]: 4,
  [Difficulty.MEDIUM]: 5,
  [Difficulty.HARD]: 7.5,
  [Difficulty.EXTREME]: 10,
} as const;

function getDifficultyScore(difficulty: Difficulty): number {
  return DIFFICULTY_SCORE[difficulty];
}

/**
 * Returns the multiplier based on the number of attempts.
 */

const ATTEMPT_MULTIPLIER = {
  1: 1.0,
  2: 0.7,
  3: 0.5,
} as const;

function getAttemptMultiplier(attemptNumber: number): number {
  if (attemptNumber <= 1) return ATTEMPT_MULTIPLIER[1];
  if (attemptNumber === 2) return ATTEMPT_MULTIPLIER[2];
  if (attemptNumber === 3) return ATTEMPT_MULTIPLIER[3];

  return 0.3;
}

/**
 * Returns the multiplier based on the number of hints used.
 */

const HINT_MULTIPLIER = {
  0: 1.0,
  1: 0.9,
  2: 0.75,
} as const;

function getHintMultiplier(hintsUsed: number): number {
  if (hintsUsed <= 0) return HINT_MULTIPLIER[0];
  if (hintsUsed === 1) return HINT_MULTIPLIER[1];
  if (hintsUsed === 2) return HINT_MULTIPLIER[2];

  return 0.5;
}

/**
 * Calculates the evidence score before applying diminishing returns.
 */
function calculateEvidenceScore(
  evidence: LearningEvidence
): number {
  const difficultyScore = getDifficultyScore(evidence.difficulty);
  const attemptMultiplier = getAttemptMultiplier(evidence.attemptNumber);
  const hintMultiplier = getHintMultiplier(evidence.hintsUsed);

  return difficultyScore * attemptMultiplier * hintMultiplier;
}

/**
 * Calculates the mastery gain using diminishing returns.
 */
function calculateDelta(
  currentMastery: number,
  evidenceScore: number
): number {
  return evidenceScore * (1 - currentMastery / 100);
}

/**
 * Ensures the mastery value stays within the valid range (0-100).
 */
function clampMastery(mastery: number): number {
  return Math.max(0, Math.min(100, mastery));
}

/**
 * Builds a structured explanation for the mastery update.
 */
function buildExplanation(
  previousMastery: number,
  newMastery: number,
  delta: number,
  evidence: LearningEvidence
): Explanation {
  const factors: string[] = [];

  factors.push(`${evidence.difficulty} Problem`);

  if (evidence.attemptNumber === 1)
    factors.push("First Attempt");
  else
    factors.push(`${evidence.attemptNumber} Attempts`);

  if (evidence.hintsUsed === 0)
    factors.push("No Hints");
  else
    factors.push(`${evidence.hintsUsed} Hint(s)`);

 return {
  previousMastery: Number(previousMastery.toFixed(2)),
  newMastery: Number(newMastery.toFixed(2)),
  delta: Number(delta.toFixed(2)),
  factors,
  };
}


export function updateMastery(
  state: MasteryState,
  evidence: LearningEvidence
): MasteryUpdate {
  // Only accepted submissions contribute to mastery.
  if (evidence.verdict !== Verdict.AC) {
    return {
      updatedState: state,
      explanation: {
        previousMastery: state.mastery,
        newMastery: state.mastery,
        delta: 0,
        factors: [`${evidence.verdict} - No Mastery Gain`],
      },
    };
  }

  const evidenceScore = calculateEvidenceScore(evidence);

  const delta = calculateDelta(
    state.mastery,
    evidenceScore
  );

    const newMastery = clampMastery(state.mastery + delta);

  return {
    updatedState: {
      ...state,
      mastery: newMastery,
    },
    explanation: buildExplanation(
      state.mastery,
      newMastery,
      delta,
      evidence
    ),
  };
}

