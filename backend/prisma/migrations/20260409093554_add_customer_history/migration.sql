-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "previousEmails" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "previousNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "previousPhones" TEXT[] DEFAULT ARRAY[]::TEXT[];
