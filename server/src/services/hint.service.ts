import prisma from "../db/prisma";
import { AppError } from "../utils/AppError";
import {
  CreateHintInput,
  UpdateHintInput,
} from "../validators/hint.validator";

export async function createHint(
  problemId: string,
  data: CreateHintInput
) {
  // Make sure problem exists
  const problem = await prisma.problem.findUnique({
    where: {
      id: problemId,
    },
  });

  if (!problem) {
    throw new AppError("Problem not found", 404);
  }

  // Prevent duplicate hint order
  const existingHint = await prisma.hint.findUnique({
    where: {
      problemId_order: {
        problemId,
        order: data.order,
      },
    },
  });

  if (existingHint) {
    throw new AppError(
      `Hint order ${data.order} already exists for this problem`,
      409
    );
  }

  return prisma.hint.create({
    data: {
      problemId,
      content: data.content,
      order: data.order,
    },
  });
}

export async function getProblemHints(
  problemId: string
) {
  const problem = await prisma.problem.findUnique({
    where: {
      id: problemId,
    },
  });

  if (!problem) {
    throw new AppError("Problem not found", 404);
  }

  return prisma.hint.findMany({
    where: {
      problemId,
    },

    orderBy: {
      order: "asc",
    },

    select: {
      id: true,
      content: true,
      order: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateHint(
  problemId: string,
  hintId: string,
  data: UpdateHintInput
) {
  const hint = await prisma.hint.findFirst({
    where: {
      id: hintId,
      problemId,
    },
  });

  if (!hint) {
    throw new AppError("Hint not found", 404);
  }

  // If order is changing, make sure it isn't already used
  if (
    data.order !== undefined &&
    data.order !== hint.order
  ) {
    const existingHint =
      await prisma.hint.findUnique({
        where: {
          problemId_order: {
            problemId,
            order: data.order,
          },
        },
      });

    if (existingHint) {
      throw new AppError(
        `Hint order ${data.order} already exists for this problem`,
        409
      );
    }
  }

  return prisma.hint.update({
    where: {
      id: hintId,
    },

    data: {
      ...(data.content !== undefined && {
        content: data.content,
      }),

      ...(data.order !== undefined && {
        order: data.order,
      }),
    },
  });
}

export async function deleteHint(
  problemId: string,
  hintId: string
) {
  const hint = await prisma.hint.findFirst({
    where: {
      id: hintId,
      problemId,
    },
  });

  if (!hint) {
    throw new AppError("Hint not found", 404);
  }

  await prisma.hint.delete({
    where: {
      id: hintId,
    },
  });

  return {
    message: "Hint deleted successfully",
  };
}

export async function viewHint(
  userId: string,
  problemId: string,
  hintId: string
) {
  // Verify the hint belongs to this problem
  const hint = await prisma.hint.findFirst({
    where: {
      id: hintId,
      problemId,
    },
  });

  if (!hint) {
    throw new AppError("Hint not found", 404);
  }

  // Get all hints for this problem in order
  const hints = await prisma.hint.findMany({
    where: {
      problemId,
    },
    orderBy: {
      order: "asc",
    },
    select: {
      id: true,
      order: true,
    },
  });

  // Make sure the requested hint exists in the sequence
  const hintIndex = hints.findIndex(
    (item) => item.id === hintId
  );

  if (hintIndex === -1) {
    throw new AppError("Hint not found", 404);
  }

  // Check whether this hint was already viewed
  const existingView =
    await prisma.userHintView.findUnique({
      where: {
        userId_hintId: {
          userId,
          hintId,
        },
      },
    });

  // Already viewed → return it without creating another record
  if (existingView) {
    const hintsViewed =
      await prisma.userHintView.count({
        where: {
          userId,
          problemId,
        },
      });

    return {
      hint: {
        id: hint.id,
        content: hint.content,
        order: hint.order,
      },
      hintsViewed,
      alreadyViewed: true,
    };
  }

  // Determine the previous hint
  const previousHint = hints[hintIndex - 1];

  // If this isn't the first hint, previous hint
  // must already have been viewed.
  if (previousHint) {
    const previousView =
      await prisma.userHintView.findUnique({
        where: {
          userId_hintId: {
            userId,
            hintId: previousHint.id,
          },
        },
      });

    if (!previousView) {
      throw new AppError(
        `You must view Hint ${previousHint.order} first`,
        400
      );
    }
  }

  // Record the first-time view
  await prisma.userHintView.create({
    data: {
      userId,
      hintId,
      problemId,
    },
  });

  const hintsViewed =
    await prisma.userHintView.count({
      where: {
        userId,
        problemId,
      },
    });

  return {
    hint: {
      id: hint.id,
      content: hint.content,
      order: hint.order,
    },
    hintsViewed,
    alreadyViewed: false,
  };
}