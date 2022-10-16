/*
  Warnings:

  - Added the required column `location` to the `stages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stages" ADD COLUMN     "location" TEXT NOT NULL;
