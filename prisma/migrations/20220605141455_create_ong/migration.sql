-- CreateTable
CREATE TABLE "ongs" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT E'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ongs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ong_personal_data" (
    "id" TEXT NOT NULL,
    "ongId" TEXT NOT NULL,
    "document" VARCHAR(11) NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "phone" VARCHAR(10),
    "telephone" VARCHAR(11) NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "ongs_email_key" ON "ongs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ong_personal_data_ongId_key" ON "ong_personal_data"("ongId");

-- CreateIndex
CREATE UNIQUE INDEX "ong_personal_data_document_key" ON "ong_personal_data"("document");

-- CreateIndex
CREATE UNIQUE INDEX "ong_address_ongId_key" ON "ong_address"("ongId");

-- AddForeignKey
ALTER TABLE "ong_personal_data" ADD CONSTRAINT "ong_personal_data_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ong_address" ADD CONSTRAINT "ong_address_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
