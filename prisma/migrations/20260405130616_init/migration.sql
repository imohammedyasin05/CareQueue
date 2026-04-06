-- CreateTable
CREATE TABLE "Prediction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patients" INTEGER NOT NULL,
    "doctors" INTEGER NOT NULL,
    "avgConsultationTime" INTEGER NOT NULL,
    "estimatedWaitTime" REAL NOT NULL,
    "queueStatus" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Available',
    "patientsToday" INTEGER NOT NULL DEFAULT 0,
    "maxPatients" INTEGER NOT NULL DEFAULT 20,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
