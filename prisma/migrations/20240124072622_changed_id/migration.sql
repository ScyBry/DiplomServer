/*
  Warnings:

  - The primary key for the `departments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `groups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `subjects` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_departmentId_fkey";

-- AlterTable
ALTER TABLE "departments" DROP CONSTRAINT "departments_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "departments_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "departments_id_seq";

-- AlterTable
ALTER TABLE "groups" DROP CONSTRAINT "groups_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "departmentId" SET DATA TYPE TEXT,
ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "groups_id_seq";

-- AlterTable
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "subjects_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "subjects_id_seq";

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
