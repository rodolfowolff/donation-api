-- CreateEnum
CREATE TYPE "FaqType" AS ENUM ('GENERAL', 'ONG', 'DONOR');

-- CreateTable
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "question" VARCHAR(200) NOT NULL,
    "answer" VARCHAR(200) NOT NULL,
    "type" "FaqType" NOT NULL DEFAULT E'GENERAL',
    "status" "Status" NOT NULL DEFAULT E'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);
