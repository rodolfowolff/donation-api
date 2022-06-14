/*
  Warnings:

  - Added the required column `responsible` to the `ong_personal_data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ong_personal_data" ADD COLUMN     "responsible" VARCHAR(50) NOT NULL,
ALTER COLUMN "description" SET DATA TYPE TEXT;
