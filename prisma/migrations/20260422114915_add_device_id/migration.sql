/*
  Warnings:

  - A unique constraint covering the columns `[deviceId]` on the table `Garden` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Garden" ADD COLUMN "deviceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Garden_deviceId_key" ON "Garden"("deviceId");
