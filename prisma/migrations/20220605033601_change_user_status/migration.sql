/*
  Warnings:

  - You are about to drop the column `active` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "active",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT E'ACTIVE';

-- RenameIndex
ALTER INDEX "user_personal_data_document" RENAME TO "user_personal_data_document_key";
