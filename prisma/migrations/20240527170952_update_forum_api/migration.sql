-- DropForeignKey
ALTER TABLE "commentForum" DROP CONSTRAINT "commentForum_forumDiskusiId_fkey";

-- DropForeignKey
ALTER TABLE "commentKelas" DROP CONSTRAINT "commentKelas_kelasId_fkey";

-- DropForeignKey
ALTER TABLE "commentKelas" DROP CONSTRAINT "commentKelas_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "kelas" DROP CONSTRAINT "kelas_ownerId_fkey";

-- AlterTable
ALTER TABLE "forumDiskusi" ADD COLUMN     "dislike" STRING[];
ALTER TABLE "forumDiskusi" ADD COLUMN     "like" STRING[];

-- AddForeignKey
ALTER TABLE "kelas" ADD CONSTRAINT "kelas_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentForum" ADD CONSTRAINT "commentForum_forumDiskusiId_fkey" FOREIGN KEY ("forumDiskusiId") REFERENCES "forumDiskusi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentKelas" ADD CONSTRAINT "commentKelas_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentKelas" ADD CONSTRAINT "commentKelas_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "kelas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
