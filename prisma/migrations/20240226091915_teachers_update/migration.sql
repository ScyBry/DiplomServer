/*
  Warnings:

  - You are about to drop the column `teacherId` on the `subjects` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_teacherId_fkey";

-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "teacherId";

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "subjectId" TEXT;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
