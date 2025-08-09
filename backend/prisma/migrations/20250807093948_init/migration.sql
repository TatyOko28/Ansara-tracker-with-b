/*
  Warnings:

  - Added the required column `updateAt` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PLANNED', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('TODAY', 'EVENING', 'TOMORROW', 'SOMEDAY');

-- AlterTable
ALTER TABLE "public"."Task" ADD COLUMN     "createAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;
