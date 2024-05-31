/*
  Warnings:

  - You are about to drop the `scheduleSubject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "scheduleSubject" DROP CONSTRAINT "scheduleSubject_dayScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "scheduleSubject" DROP CONSTRAINT "scheduleSubject_subjectId_fkey";

-- DropTable
DROP TABLE "scheduleSubject";

-- CreateTable
CREATE TABLE "scheduleSubjects" (
    "id" TEXT NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "subjectId" TEXT,
    "dayScheduleId" TEXT,

    CONSTRAINT "scheduleSubjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cabinets" (
    "id" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "cabinets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleSubjectCabinet" (
    "scheduleSubjectId" TEXT NOT NULL,
    "cabinetId" TEXT NOT NULL,

    CONSTRAINT "ScheduleSubjectCabinet_pkey" PRIMARY KEY ("scheduleSubjectId","cabinetId")
);

-- CreateIndex
CREATE UNIQUE INDEX "cabinets_roomNumber_key" ON "cabinets"("roomNumber");

-- AddForeignKey
ALTER TABLE "scheduleSubjects" ADD CONSTRAINT "scheduleSubjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduleSubjects" ADD CONSTRAINT "scheduleSubjects_dayScheduleId_fkey" FOREIGN KEY ("dayScheduleId") REFERENCES "daySchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSubjectCabinet" ADD CONSTRAINT "ScheduleSubjectCabinet_scheduleSubjectId_fkey" FOREIGN KEY ("scheduleSubjectId") REFERENCES "scheduleSubjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSubjectCabinet" ADD CONSTRAINT "ScheduleSubjectCabinet_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "cabinets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
