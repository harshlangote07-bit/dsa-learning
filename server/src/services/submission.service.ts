import prisma from "../db/prisma";
import {
  Verdict,
  Language,
} from "../generated/prisma/client";
import { AppError } from "../utils/AppError";
import { updateUserMastery } from "./mastery.service";
import { judgeCpp } from "./judge.service";

export type CreateSubmissionInput = {
  userId: string;
  problemId: string;
  language: Language;
  code: string;
};

function calculateScore(verdict: Verdict): number {
  switch (verdict) {
    case Verdict.AC:
      return 1;

    default:
      return 0;
  }
}

export async function createSubmission(
  data: CreateSubmissionInput
) {
  // ==========================
  // Check problem
  // ==========================

  const problem = await prisma.problem.findUnique({
    where: {
      id: data.problemId,
    },
  });

  if (!problem) {
    throw new AppError("Problem not found", 404);
  }

  // ==========================
  // Get actual hints viewed
  // ==========================

  const hintsViewed =
    await prisma.userHintView.count({
      where: {
        userId: data.userId,
        problemId: data.problemId,
      },
    });

  // ==========================
  // Judge code
  // ==========================

  if (data.language !== Language.CPP) {
    throw new AppError(
      "Only C++ is currently supported",
      400
    );
  }

  const judgeResult = await judgeCpp(
    data.problemId,
    data.code
  );

  const verdict = judgeResult.verdict;
  const executionTime =
    judgeResult.executionTime;

  // ==========================
  // Create submission
  // ==========================

  return prisma.$transaction(async (tx) => {
    // Total submission number
    const submissionCount =
      await tx.submission.count({
        where: {
          userId: data.userId,
          problemId: data.problemId,
        },
      });

    const submissionNumber =
      submissionCount + 1;

    // ==========================
    // Accepted submission number
    // ==========================

    let acceptedSubmissionNumber = 0;

    if (verdict === Verdict.AC) {
      const acceptedSubmissionCount =
        await tx.submission.count({
          where: {
            userId: data.userId,
            problemId: data.problemId,
            verdict: Verdict.AC,
          },
        });

      acceptedSubmissionNumber =
        acceptedSubmissionCount + 1;
    }

    const score = calculateScore(verdict);

    const submission =
      await tx.submission.create({
        data: {
          userId: data.userId,
          problemId: data.problemId,

          language: data.language,

          code: data.code,

          verdict,

          executionTime,

          submissionNumber,

          score,

          // Server-calculated value
          hintsViewed,
        },
      });

    // ==========================
    // Update mastery on AC
    // ==========================

    if (score > 0) {
      await updateUserMastery(
        tx,
        data.userId,
        data.problemId,
        submission.id,
        acceptedSubmissionNumber,
        hintsViewed
      );
    }

    return {
      submission,

      judge: {
        verdict,
        executionTime,
        passedTests:
          judgeResult.passedTests,
        totalTests:
          judgeResult.totalTests,
      },
    };
  });
}

export async function getUserSubmissions(
  userId: string,
  page: number,
  limit: number,
  verdict?: Verdict,
  problemId?: string,
  language?: Language
) {
  const skip = (page - 1) * limit;

  const where = {
    userId,

    ...(verdict && {
      verdict,
    }),

    ...(problemId && {
      problemId,
    }),

    ...(language && {
      language,
    }),
  };

  const [submissions, total] =
    await prisma.$transaction([
      prisma.submission.findMany({
        where,

        select: {
          id: true,
          language: true,
          executionTime: true,
          verdict: true,
          submissionNumber: true,
          score: true,

          // Stored server-calculated value
          hintsViewed: true,

          submittedAt: true,

          problem: {
            select: {
              id: true,
              title: true,
              difficulty: true,
            },
          },
        },

        orderBy: {
          submittedAt: "desc",
        },

        skip,
        take: limit,
      }),

      prisma.submission.count({
        where,
      }),
    ]);

  return {
    submissions,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
}

export async function getSubmissionById(
  submissionId: string,
  userId: string
) {
  const submission =
    await prisma.submission.findFirst({
      where: {
        id: submissionId,
        userId,
      },

      select: {
        id: true,
        language: true,
        code: true,
        executionTime: true,
        verdict: true,
        submissionNumber: true,
        score: true,

        // Stored server-calculated value
        hintsViewed: true,

        submittedAt: true,

        problem: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
          },
        },
      },
    });

  if (!submission) {
    throw new AppError(
      "Submission not found",
      404
    );
  }

  return submission;
}