-- CreateTable
CREATE TABLE "UserHintView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hintId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserHintView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserHintView_userId_idx" ON "UserHintView"("userId");

-- CreateIndex
CREATE INDEX "UserHintView_hintId_idx" ON "UserHintView"("hintId");

-- CreateIndex
CREATE INDEX "UserHintView_problemId_idx" ON "UserHintView"("problemId");

-- CreateIndex
CREATE UNIQUE INDEX "UserHintView_userId_hintId_key" ON "UserHintView"("userId", "hintId");

-- AddForeignKey
ALTER TABLE "UserHintView" ADD CONSTRAINT "UserHintView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHintView" ADD CONSTRAINT "UserHintView_hintId_fkey" FOREIGN KEY ("hintId") REFERENCES "Hint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHintView" ADD CONSTRAINT "UserHintView_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
