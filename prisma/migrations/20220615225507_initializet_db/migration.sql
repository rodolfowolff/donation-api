-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "FaqType" AS ENUM ('GENERAL', 'ONG', 'DONOR');

-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DonationType" AS ENUM ('PIX', 'CASH', 'CREDIT_CARD', 'FOOD', 'CLOTHING', 'FURNITURE', 'ELETRONIC', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR(20) NOT NULL,
    "lastName" VARCHAR(20) NOT NULL,
    "document" VARCHAR(11) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "status" "Status" NOT NULL DEFAULT E'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_personal_data" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "birthDate" VARCHAR(10) NOT NULL,
    "telephone" VARCHAR(11) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_personal_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_address" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "zipCode" VARCHAR(8) NOT NULL,
    "street" VARCHAR(50) NOT NULL,
    "number" VARCHAR(10) NOT NULL,
    "complement" VARCHAR(50),
    "neighborhood" VARCHAR(50) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ongs" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "document" VARCHAR(14) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "status" "Status" NOT NULL DEFAULT E'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ongs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ong_personal_data" (
    "id" TEXT NOT NULL,
    "ongId" TEXT NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "banner" VARCHAR(200),
    "phone" VARCHAR(10),
    "telephone" VARCHAR(11) NOT NULL,
    "responsible" VARCHAR(50) NOT NULL,
    "website" VARCHAR(50),
    "facebook" VARCHAR(50),
    "instagram" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ong_personal_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ong_address" (
    "id" TEXT NOT NULL,
    "ongId" TEXT NOT NULL,
    "zipCode" VARCHAR(8) NOT NULL,
    "street" VARCHAR(50) NOT NULL,
    "number" VARCHAR(10) NOT NULL,
    "complement" VARCHAR(50),
    "neighborhood" VARCHAR(50) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "latitude" DECIMAL(10,6),
    "longitude" DECIMAL(10,6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ong_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ong_bank_account" (
    "id" TEXT NOT NULL,
    "ongId" TEXT NOT NULL,
    "bankName" VARCHAR(50) NOT NULL,
    "agency" VARCHAR(10) NOT NULL,
    "account" VARCHAR(15) NOT NULL,
    "owner" VARCHAR(50) NOT NULL,
    "ownerDocument" VARCHAR(14) NOT NULL,
    "pixKeyType" VARCHAR(50) NOT NULL,
    "pixKey" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ong_bank_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(50) NOT NULL,
    "ongId" VARCHAR(50) NOT NULL,
    "value" DECIMAL(10,2) DEFAULT 0.00,
    "type" "DonationType" NOT NULL DEFAULT E'PIX',
    "status" "DonationStatus" NOT NULL DEFAULT E'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(36) NOT NULL,
    "ongId" VARCHAR(36) NOT NULL,
    "comment" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT E'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_document_key" ON "users"("document");

-- CreateIndex
CREATE UNIQUE INDEX "user_personal_data_userId_key" ON "user_personal_data"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_personal_data_email_key" ON "user_personal_data"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_address_userId_key" ON "user_address"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ongs_document_key" ON "ongs"("document");

-- CreateIndex
CREATE UNIQUE INDEX "ong_personal_data_ongId_key" ON "ong_personal_data"("ongId");

-- CreateIndex
CREATE UNIQUE INDEX "ong_personal_data_email_key" ON "ong_personal_data"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ong_address_ongId_key" ON "ong_address"("ongId");

-- CreateIndex
CREATE UNIQUE INDEX "ong_bank_account_ongId_key" ON "ong_bank_account"("ongId");

-- AddForeignKey
ALTER TABLE "user_personal_data" ADD CONSTRAINT "user_personal_data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_address" ADD CONSTRAINT "user_address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ong_personal_data" ADD CONSTRAINT "ong_personal_data_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ong_address" ADD CONSTRAINT "ong_address_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ong_bank_account" ADD CONSTRAINT "ong_bank_account_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
