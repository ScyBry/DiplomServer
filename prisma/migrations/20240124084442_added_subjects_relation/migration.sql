/*
  Warnings:

  - You are about to drop the column `subjects` on the `groups` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "groups" DROP COLUMN "subjects";

-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "groupId" TEXT;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
