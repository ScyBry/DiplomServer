-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "totalHours" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hoursPerGroup" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "groupId" TEXT
);

-- CreateTable
CREATE TABLE "TeacherSubject" (
    "teacherId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "TeacherSubject_pkey" PRIMARY KEY ("teacherId","subjectId")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "daySchedule" (
    "id" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "lastConfirm" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "daySchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_id_key" ON "subjects"("id");

-- CreateIndex
CREATE UNIQUE INDEX "groups_name_key" ON "groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cabinets_roomNumber_key" ON "cabinets"("roomNumber");

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubject" ADD CONSTRAINT "TeacherSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubject" ADD CONSTRAINT "TeacherSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduleSubjects" ADD CONSTRAINT "scheduleSubjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduleSubjects" ADD CONSTRAINT "scheduleSubjects_dayScheduleId_fkey" FOREIGN KEY ("dayScheduleId") REFERENCES "daySchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSubjectCabinet" ADD CONSTRAINT "ScheduleSubjectCabinet_scheduleSubjectId_fkey" FOREIGN KEY ("scheduleSubjectId") REFERENCES "scheduleSubjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSubjectCabinet" ADD CONSTRAINT "ScheduleSubjectCabinet_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "cabinets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daySchedule" ADD CONSTRAINT "daySchedule_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
