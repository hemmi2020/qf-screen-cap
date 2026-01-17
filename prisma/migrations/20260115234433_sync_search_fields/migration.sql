/*
  Warnings:

  - Added the required column `userId` to the `Search` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Search" ADD COLUMN     "userEmail" TEXT NOT NULL DEFAULT 'unknown@example.com',
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL DEFAULT 'Unknown';

-- AddForeignKey
ALTER TABLE "Search" ADD CONSTRAINT "Search_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
