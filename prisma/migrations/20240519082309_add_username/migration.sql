/*
  Warnings:

  - Added the required column `username` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterSequence
ALTER SEQUENCE "commentForum_id_seq" MAXVALUE 9223372036854775807;

-- AlterSequence
ALTER SEQUENCE "commentKelas_id_seq" MAXVALUE 9223372036854775807;

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "username" STRING NOT NULL;
