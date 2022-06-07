-- DropForeignKey
ALTER TABLE "donations" DROP CONSTRAINT "donations_ongId_fkey";

-- DropForeignKey
ALTER TABLE "donations" DROP CONSTRAINT "donations_userId_fkey";

-- DropIndex
DROP INDEX "donations_ongId_key";

-- DropIndex
DROP INDEX "donations_userId_key";
