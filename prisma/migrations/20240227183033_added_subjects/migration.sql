-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "groupId" TEXT;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
