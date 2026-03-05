/*
  Warnings:

  - A unique constraint covering the columns `[inviteCode]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "inviteCode" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_inviteCode_key" ON "Organization"("inviteCode");
