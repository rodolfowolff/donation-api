/*
  Warnings:

  - You are about to drop the column `document` on the `ong_personal_data` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `ongs` table. All the data in the column will be lost.
  - You are about to drop the column `document` on the `user_personal_data` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `ong_personal_data` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[document]` on the table `ongs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `user_personal_data` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[document]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `ong_personal_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document` to the `ongs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `user_personal_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ong_personal_data_document_key";

-- DropIndex
DROP INDEX "ongs_email_key";

-- DropIndex
DROP INDEX "user_personal_data_document_key";

-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "ong_personal_data" DROP COLUMN "document",
ADD COLUMN     "email" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "ongs" DROP COLUMN "email",
ADD COLUMN     "document" VARCHAR(14) NOT NULL;

-- AlterTable
ALTER TABLE "user_personal_data" DROP COLUMN "document",
ADD COLUMN     "email" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email",
ADD COLUMN     "document" VARCHAR(11) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ong_personal_data_email_key" ON "ong_personal_data"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ongs_document_key" ON "ongs"("document");

-- CreateIndex
CREATE UNIQUE INDEX "user_personal_data_email_key" ON "user_personal_data"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_document_key" ON "users"("document");
