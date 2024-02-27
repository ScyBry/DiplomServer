/*
  Warnings:

  - You are about to drop the column `subjectId` on the `groups` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_subjectId_fkey";

-- AlterTable
ALTER TABLE "groups" DROP COLUMN "subjectId";
