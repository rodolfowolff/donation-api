/*
  Warnings:

  - Added the required column `banner` to the `ong_personal_data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ong_personal_data" ADD COLUMN     "banner" VARCHAR(200) NOT NULL;
