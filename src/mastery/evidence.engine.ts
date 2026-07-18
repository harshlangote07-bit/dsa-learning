
import {
  Difficulty,
  LearningEvidence,
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
export function calculateEvidenceScore(
  evidence: LearningEvidence
): number {
  const difficultyScore = getDifficultyScore(evidence.difficulty);
  const attemptMultiplier = getAttemptMultiplier(evidence.attemptNumber);
  const hintMultiplier = getHintMultiplier(evidence.hintsUsed);

  return difficultyScore * attemptMultiplier * hintMultiplier;
}