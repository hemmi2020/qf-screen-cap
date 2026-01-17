/*
  Warnings:

  - You are about to drop the column `userEmail` on the `Search` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Search` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Search` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Search" DROP CONSTRAINT "Search_userId_fkey";

-- AlterTable
ALTER TABLE "Search" DROP COLUMN "userEmail",
DROP COLUMN "userId",
DROP COLUMN "userName";
