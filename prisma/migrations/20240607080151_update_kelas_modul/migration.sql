/*
  Warnings:

  - You are about to drop the column `moduleURL` on the `kelas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "kelas" DROP COLUMN "moduleURL";
ALTER TABLE "kelas" ADD COLUMN     "modul" STRING;
