/*
  Warnings:

  - Added the required column `type` to the `Search` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Search" ADD COLUMN     "fps" INTEGER,
ADD COLUMN     "multiPage" BOOLEAN,
ADD COLUMN     "type" TEXT NOT NULL;
