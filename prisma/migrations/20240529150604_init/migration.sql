/*
  Warnings:

  - Added the required column `location` to the `departments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "location" TEXT NOT NULL;