/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `donations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ongId]` on the table `donations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "donations_userId_key" ON "donations"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "donations_ongId_key" ON "donations"("ongId");
