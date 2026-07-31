/*
  Warnings:

  - A unique constraint covering the columns `[userId,problemId,submissionNumber]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "score" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Submission_userId_problemId_submissionNumber_key" ON "Submission"("userId", "problemId", "submissionNumber");
