/*
  Warnings:

  - Added the required column `harga` to the `kelas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "kelas" ADD COLUMN     "harga" INT4 NOT NULL;
ALTER TABLE "kelas" ALTER COLUMN "jadwal" SET NOT NULL;
ALTER TABLE "kelas" ALTER COLUMN "jadwal" SET DATA TYPE STRING;
