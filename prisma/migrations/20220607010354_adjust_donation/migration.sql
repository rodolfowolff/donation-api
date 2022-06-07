/*
  Warnings:

  - You are about to alter the column `value` on the `donations` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - The `status` column on the `donations` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DonationType" AS ENUM ('PIX', 'CASH', 'CREDIT_CARD');

-- AlterTable
ALTER TABLE "donations" ADD COLUMN     "type" "DonationType" NOT NULL DEFAULT E'PIX',
ALTER COLUMN "value" DROP NOT NULL,
ALTER COLUMN "value" SET DEFAULT 0.00,
ALTER COLUMN "value" SET DATA TYPE DECIMAL(10,2),
DROP COLUMN "status",
ADD COLUMN     "status" "DonationStatus" NOT NULL DEFAULT E'PENDING';
