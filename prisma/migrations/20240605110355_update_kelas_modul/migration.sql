/*
  Warnings:

  - You are about to drop the `modul` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterSequence
ALTER SEQUENCE "forumDiskusi_id_seq" MAXVALUE 9223372036854775807;

-- AlterTable
ALTER TABLE "kelas" ADD COLUMN     "moduleURL" STRING;

-- DropTable
DROP TABLE "modul";
