import {
  Difficulty,
  Explanation,
  LearningEvidence,
  MasteryState,
  MasteryUpdate,
  Verdict,
} from "./mastery.types";


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
  evidenceScore: number,
  evidence: LearningEvidence
): MasteryUpdate {
  // Only accepted submissions contribute to mastery.

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

