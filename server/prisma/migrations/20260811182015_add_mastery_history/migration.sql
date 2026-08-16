-- CreateTable
CREATE TABLE "MasteryHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "previousMastery" DOUBLE PRECISION NOT NULL,
    "newMastery" DOUBLE PRECISION NOT NULL,
    "delta" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MasteryHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MasteryHistory_userId_idx" ON "MasteryHistory"("userId");

-- CreateIndex
CREATE INDEX "MasteryHistory_topicId_idx" ON "MasteryHistory"("topicId");

-- CreateIndex
CREATE INDEX "MasteryHistory_submissionId_idx" ON "MasteryHistory"("submissionId");

-- CreateIndex
CREATE INDEX "MasteryHistory_createdAt_idx" ON "MasteryHistory"("createdAt");

-- AddForeignKey
ALTER TABLE "MasteryHistory" ADD CONSTRAINT "MasteryHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasteryHistory" ADD CONSTRAINT "MasteryHistory_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasteryHistory" ADD CONSTRAINT "MasteryHistory_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
