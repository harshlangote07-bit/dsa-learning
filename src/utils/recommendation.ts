import { Difficulty } from "../generated/prisma/client";

export interface RecommendationInput {
  mastery: number;
  averageMastery: number;
  topicWeight: number;
  difficulty: Difficulty;
  previousAttempts: number;
  attemptedRecently: boolean;
}

const RECOMMENDATION_CONFIG = {
  WEIGHTS: {
    TOPIC: 1.0,
    DIFFICULTY: 0.5,
    ATTEMPT: 0.3,
    RECENT_PENALTY: 1.0,
  },

  THRESHOLDS: {
    BEGINNER: 30,
    INTERMEDIATE: 70,
    LOW_MASTERY: 40,
    MAX_MASTERY: 100,
    MAX_ATTEMPT_BONUS: 20,
    ATTEMPT_BONUS: 5,
    RECENT_ATTEMPT_DAYS: 7,
  },
} as const;

const DIFFICULTY_SCORE = {
  beginner: {
    [Difficulty.EASY]: 20,
    [Difficulty.MEDIUM]: 5,
    [Difficulty.HARD]: -20,
    [Difficulty.EXTREME]: -40,
  },

  intermediate: {
    [Difficulty.EASY]: 10,
    [Difficulty.MEDIUM]: 20,
    [Difficulty.HARD]: 5,
    [Difficulty.EXTREME]: -10,
  },

  advanced: {
    [Difficulty.EASY]: -10,
    [Difficulty.MEDIUM]: 10,
    [Difficulty.HARD]: 25,
    [Difficulty.EXTREME]: 35,
  },
} as const;

function getTopicScore(
  mastery: number,
  topicWeight: number
): number {
  const need = Math.max(
    0,
    RECOMMENDATION_CONFIG.THRESHOLDS.MAX_MASTERY - mastery
  );

  return need * topicWeight;
}

function getDifficultyScore(
  averageMastery: number,
  difficulty: Difficulty
): number {
  if (
    averageMastery <
    RECOMMENDATION_CONFIG.THRESHOLDS.BEGINNER
  ) {
    return DIFFICULTY_SCORE.beginner[difficulty];
  }

  if (
    averageMastery <
    RECOMMENDATION_CONFIG.THRESHOLDS.INTERMEDIATE
  ) {
    return DIFFICULTY_SCORE.intermediate[difficulty];
  }

  return DIFFICULTY_SCORE.advanced[difficulty];
}

function getAttemptScore(previousAttempts: number): number {
  return Math.min(
    previousAttempts *
      RECOMMENDATION_CONFIG.THRESHOLDS.ATTEMPT_BONUS,
    RECOMMENDATION_CONFIG.THRESHOLDS.MAX_ATTEMPT_BONUS
  );
}

function getRecentPenalty(
  attemptedRecently: boolean
): number {
  return attemptedRecently ? 10 : 0;
}

export function calculateRecommendationScore(
  input: RecommendationInput
): number {
  const topicScore = getTopicScore(
    input.mastery,
    input.topicWeight
  );

  const difficultyScore = getDifficultyScore(
    input.averageMastery,
    input.difficulty
  );

  const attemptScore = getAttemptScore(
    input.previousAttempts
  );

  const recentPenalty = getRecentPenalty(
    input.attemptedRecently
  );

  const finalScore =
    topicScore *
      RECOMMENDATION_CONFIG.WEIGHTS.TOPIC +
    difficultyScore *
      RECOMMENDATION_CONFIG.WEIGHTS.DIFFICULTY +
    attemptScore *
      RECOMMENDATION_CONFIG.WEIGHTS.ATTEMPT -
    recentPenalty *
      RECOMMENDATION_CONFIG.WEIGHTS.RECENT_PENALTY;

  return Number(finalScore.toFixed(2));
}

export function generateRecommendationReason(
  weakestTopic: string,
  mastery: number,
  difficulty: Difficulty,
  previousAttempts: number
): string {
  if (previousAttempts > 0) {
    return `You've attempted this problem ${previousAttempts} time(s). Try solving it again.`;
  }

  if (
    mastery <
    RECOMMENDATION_CONFIG.THRESHOLDS.LOW_MASTERY
  ) {
    return `Improve your ${weakestTopic} skills. Current mastery: ${mastery.toFixed(
      0
    )}%.`;
  }

  return `A good ${difficulty.toLowerCase()} problem matching your current progress.`;
}

export const RecommendationConfig =
  RECOMMENDATION_CONFIG;