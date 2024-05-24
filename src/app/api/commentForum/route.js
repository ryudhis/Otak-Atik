import prisma from "@/utils/prisma";

export async function GET() {
  try {
    const commentForum = await prisma.commentForum.findMany();

    return Response.json({
      status: 200,
      message: "Berhasil ambil semua data!",
      data: commentForum,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 400, message: "Something went wrong!" });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const commentForum = await prisma.commentForum.create({
      data: {
        content: data.content,
        postedAt: data.postedAt,
        owner: {
          connect: {
            id: data.ownerId,
          },
        },
        forumDiskusi: {
          connect: {
            id: data.forumDiskusiId,
          },
        },
      },
    });

    return Response.json({
      status: 200,
      message: "Berhasil buat data!",
      data: commentForum,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 400, message: "Something went wrong!" });
  }
}
