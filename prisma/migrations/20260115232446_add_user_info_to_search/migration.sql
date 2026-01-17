-- AlterTable
ALTER TABLE "Search" ADD COLUMN     "userEmail" TEXT NOT NULL DEFAULT 'unknown@example.com',
ADD COLUMN     "userName" TEXT NOT NULL DEFAULT 'Unknown';
