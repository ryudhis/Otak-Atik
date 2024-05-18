/*
  Warnings:

  - The `spesifikasi` column on the `kelas` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Account" ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "kelas" DROP COLUMN "spesifikasi";
ALTER TABLE "kelas" ADD COLUMN     "spesifikasi" STRING[];
ALTER TABLE "kelas" ADD CONSTRAINT "kelas_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "_kelasDiambil" (
    "A" INT4 NOT NULL,
    "B" INT4 NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_kelasDiambil_AB_unique" ON "_kelasDiambil"("A", "B");

-- CreateIndex
CREATE INDEX "_kelasDiambil_B_index" ON "_kelasDiambil"("B");

-- AddForeignKey
ALTER TABLE "_kelasDiambil" ADD CONSTRAINT "_kelasDiambil_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_kelasDiambil" ADD CONSTRAINT "_kelasDiambil_B_fkey" FOREIGN KEY ("B") REFERENCES "kelas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
