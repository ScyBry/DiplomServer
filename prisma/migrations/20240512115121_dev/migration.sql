-- DropForeignKey
ALTER TABLE "DaySchedule" DROP CONSTRAINT "DaySchedule_groupId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleSubject" DROP CONSTRAINT "ScheduleSubject_dayScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleSubject" DROP CONSTRAINT "ScheduleSubject_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_groupId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherSubject" DROP CONSTRAINT "TeacherSubject_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherSubject" DROP CONSTRAINT "TeacherSubject_teacherId_fkey";

-- AlterTable
ALTER TABLE "ScheduleSubject" ALTER COLUMN "subjectId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubject" ADD CONSTRAINT "TeacherSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubject" ADD CONSTRAINT "TeacherSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSubject" ADD CONSTRAINT "ScheduleSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSubject" ADD CONSTRAINT "ScheduleSubject_dayScheduleId_fkey" FOREIGN KEY ("dayScheduleId") REFERENCES "DaySchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaySchedule" ADD CONSTRAINT "DaySchedule_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
