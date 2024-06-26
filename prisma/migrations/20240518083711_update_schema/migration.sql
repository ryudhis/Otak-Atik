-- CreateTable
CREATE TABLE "forumDiskusi" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "ownerId" INT4 NOT NULL,
    "title" STRING NOT NULL,
    "kategori" STRING NOT NULL,
    "content" STRING NOT NULL,
    "postedAt" STRING NOT NULL,

    CONSTRAINT "forumDiskusi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" INT4 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    "ownerId" INT4 NOT NULL,
    "forumDiskusiId" INT4 NOT NULL,
    "content" STRING NOT NULL,
    "postedAt" STRING NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "forumDiskusi_id_key" ON "forumDiskusi"("id");

-- CreateIndex
CREATE UNIQUE INDEX "comment_id_key" ON "comment"("id");

-- AddForeignKey
ALTER TABLE "forumDiskusi" ADD CONSTRAINT "forumDiskusi_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_forumDiskusiId_fkey" FOREIGN KEY ("forumDiskusiId") REFERENCES "forumDiskusi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
