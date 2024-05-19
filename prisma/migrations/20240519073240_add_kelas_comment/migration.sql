/*
  Warnings:

  - You are about to drop the `comment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_forumDiskusiId_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_ownerId_fkey";

-- DropTable
DROP TABLE "comment";

-- CreateTable
CREATE TABLE "commentForum" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "ownerId" INT4 NOT NULL,
    "forumDiskusiId" INT4 NOT NULL,
    "content" STRING NOT NULL,
    "postedAt" STRING NOT NULL,

    CONSTRAINT "commentForum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commentKelas" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "ownerId" INT4 NOT NULL,
    "kelasId" INT4 NOT NULL,
    "content" STRING NOT NULL,
    "postedAt" STRING NOT NULL,

    CONSTRAINT "commentKelas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "commentForum_id_key" ON "commentForum"("id");

-- CreateIndex
CREATE UNIQUE INDEX "commentKelas_id_key" ON "commentKelas"("id");

-- AddForeignKey
ALTER TABLE "commentForum" ADD CONSTRAINT "commentForum_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentForum" ADD CONSTRAINT "commentForum_forumDiskusiId_fkey" FOREIGN KEY ("forumDiskusiId") REFERENCES "forumDiskusi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentKelas" ADD CONSTRAINT "commentKelas_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentKelas" ADD CONSTRAINT "commentKelas_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
