/*
  Warnings:

  - You are about to alter the column `userId` on the `donations` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `ongId` on the `donations` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- DropForeignKey
ALTER TABLE "donations" DROP CONSTRAINT "donations_ongId_fkey";

-- DropForeignKey
ALTER TABLE "donations" DROP CONSTRAINT "donations_userId_fkey";

-- DropIndex
DROP INDEX "donations_ongId_key";

-- DropIndex
DROP INDEX "donations_userId_key";

-- AlterTable
ALTER TABLE "donations" ALTER COLUMN "userId" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "ongId" SET DATA TYPE VARCHAR(50);

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
