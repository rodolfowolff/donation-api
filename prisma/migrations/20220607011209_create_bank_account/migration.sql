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

-- CreateIndex
CREATE UNIQUE INDEX "ong_bank_account_ongId_key" ON "ong_bank_account"("ongId");

-- AddForeignKey
ALTER TABLE "ong_bank_account" ADD CONSTRAINT "ong_bank_account_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
