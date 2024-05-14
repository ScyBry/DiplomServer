/*
  Warnings:

  - You are about to drop the column `dayOfWeak` on the `DaySchedule` table. All the data in the column will be lost.
  - Added the required column `dayOfWeek` to the `DaySchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DaySchedule" DROP COLUMN "dayOfWeak",
ADD COLUMN     "dayOfWeek" TEXT NOT NULL;
