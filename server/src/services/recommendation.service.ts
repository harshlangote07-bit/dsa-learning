import prisma from "../db/prisma";
import { Verdict } from "../generated/prisma/client";
import { AppError } from "../utils/AppError";
import {
  calculateRecommendationScore,
  RecommendationInput,
  generateRecommendationReason,
  RecommendationConfig,
} from "../utils/recommendation";

type Recommendation = {
  problemId: string;
  title: string;
  difficulty: string;
  score: number;
  reason: string;
};

export async function getRecommendations(userId: string) {
  // Verify user
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Fetch user mastery and solved problems
  const [masteryRecords, solvedProblems] = await Promise.all([
    prisma.userTopicMastery.findMany({
      where: {
        userId,
      },
    }),

    prisma.submission.findMany({
      where: {
        userId,
        verdict: Verdict.AC,
      },
      distinct: ["problemId"],
      select: {
        problemId: true,
      },
    }),
  ]);

  const solvedProblemIds = solvedProblems.map(
    (problem) => problem.problemId
  );

  // Create mastery lookup
  const masteryMap = new Map<string, number>();

  masteryRecords.forEach((record) => {
    masteryMap.set(record.topicId, record.mastery);
  });

  // Average mastery
  const averageMastery =
    masteryRecords.length === 0
      ? 0
      : masteryRecords.reduce(
          (sum, topic) => sum + topic.mastery,
          0
        ) / masteryRecords.length;

  // Candidate problems
  const candidateProblems = await prisma.problem.findMany({
    where: {
      id: {
        notIn: solvedProblemIds,
      },
    },

    include: {
      topics: {
        include: {
          topic: true,
        },
      },

      submissions: {
        where: {
          userId,
        },
        orderBy: {
          submittedAt: "desc",
        },
      },
    },
  });

  const recommendations: Recommendation[] = [];

  for (const problem of candidateProblems) {
    // Skip invalid problems
    if (problem.topics.length === 0) {
      continue;
    }

    let totalScore = 0;

    let weakestTopic = "";

    let weakestMastery = 100;

    let consideredTopics = 0;

    const previousAttempts = problem.submissions.length;

    const attemptedRecently =
  previousAttempts > 0 &&
  Date.now() -
    problem.submissions[0].submittedAt.getTime() <
    RecommendationConfig.THRESHOLDS.RECENT_ATTEMPT_DAYS *
      24 *
      60 *
      60 *
      1000;

    for (const pt of problem.topics) {
      const mastery = masteryMap.get(pt.topicId) ?? 0;

      const input: RecommendationInput = {
        mastery,
        averageMastery,
        topicWeight: pt.weight,
        difficulty: problem.difficulty,
        previousAttempts,
        attemptedRecently,
      };

      totalScore += calculateRecommendationScore(input);

      consideredTopics++;

      if (mastery < weakestMastery) {
        weakestMastery = mastery;
        weakestTopic = pt.topic.name;
      }
    }

    const finalScore =
      consideredTopics === 0
        ? 0
        : totalScore / consideredTopics;

    const reason = generateRecommendationReason(
      weakestTopic,
      weakestMastery,
      problem.difficulty,
      previousAttempts
    );

    recommendations.push({
      problemId: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      score: Number(finalScore.toFixed(2)),
      reason,
    });
  }

  recommendations.sort(
    (a, b) => b.score - a.score
  );

  return recommendations.slice(0, 10);
}