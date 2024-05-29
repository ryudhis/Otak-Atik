/*
  Warnings:

  - Added the required column `durasi` to the `kelas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "kelas" ADD COLUMN     "durasi" STRING NOT NULL;
