import { calculateEvidenceScore } from "./evidence.engine";
import { updateMastery } from "./mastery.engine";

import {
  LearningEvidence,
  MasteryState,
  MasteryUpdate,
  ProblemTopic,
  Verdict,
} from "./mastery.types";

export function processSubmission(
  masteries: MasteryState[],
  problemTopics: ProblemTopic[],
  evidence: LearningEvidence
): MasteryUpdate[] {

  if (evidence.verdict !== Verdict.AC) {
    return [];
  }

  const evidenceScore = calculateEvidenceScore(evidence);

  // O(1) lookup instead of Array.find() every iteration
  const masteryMap = new Map(
    masteries.map((mastery) => [mastery.topicId, mastery])
  );

  const updates: MasteryUpdate[] = [];

  for (const topic of problemTopics) {
    const masteryState = masteryMap.get(topic.topicId);

    if (!masteryState) {
      continue;
    }

    updates.push(
      updateMastery(
        masteryState,
        evidenceScore * topic.weight,
        evidence
      )
    );
  }

  return updates;
}