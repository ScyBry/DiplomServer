/*
  Warnings:

  - You are about to drop the column `createdAt` on the `DaySchedule` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `DaySchedule` table. All the data in the column will be lost.
  - Made the column `groupId` on table `DaySchedule` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "DaySchedule" DROP CONSTRAINT "DaySchedule_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_dayScheduleId_fkey";

-- AlterTable
ALTER TABLE "DaySchedule" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "groupId" SET NOT NULL;

-- CreateTable
CREATE TABLE "ScheduleSubject" (
    "id" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "subjectId" TEXT NOT NULL,
    "dayScheduleId" TEXT,

    CONSTRAINT "ScheduleSubject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScheduleSubject" ADD CONSTRAINT "ScheduleSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSubject" ADD CONSTRAINT "ScheduleSubject_dayScheduleId_fkey" FOREIGN KEY ("dayScheduleId") REFERENCES "DaySchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaySchedule" ADD CONSTRAINT "DaySchedule_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
