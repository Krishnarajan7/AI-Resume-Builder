/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `Resume` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Resume" ADD COLUMN     "bullets" JSONB,
ADD COLUMN     "enhancedSections" JSONB,
ADD COLUMN     "suggestedSkills" JSONB,
ADD COLUMN     "summary" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Resume_id_userId_key" ON "public"."Resume"("id", "userId");
