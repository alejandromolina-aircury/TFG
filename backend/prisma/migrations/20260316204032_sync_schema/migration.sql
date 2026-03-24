/*
  Warnings:

  - You are about to drop the column `zoneId` on the `Closure` table. All the data in the column will be lost.
  - You are about to drop the column `canCombine` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the column `combinesWith` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the column `positionX` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the column `positionY` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the column `shape` on the `Table` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Table` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('ADMIN', 'STAFF');

-- DropForeignKey
ALTER TABLE "Closure" DROP CONSTRAINT "Closure_zoneId_fkey";

-- AlterTable
ALTER TABLE "Closure" DROP COLUMN "zoneId";

-- AlterTable
ALTER TABLE "Table" DROP COLUMN "canCombine",
DROP COLUMN "combinesWith",
DROP COLUMN "height",
DROP COLUMN "positionX",
DROP COLUMN "positionY",
DROP COLUMN "shape",
DROP COLUMN "width";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "TableShape";

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "StaffRole" NOT NULL DEFAULT 'STAFF',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE INDEX "Staff_email_idx" ON "Staff"("email");
