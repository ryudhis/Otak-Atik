import prisma from "@/utils/prisma";

export async function GET() {
  try {
    const forumDiskusi = await prisma.forumDiskusi.findMany({
      include: {
        owner: true,
      },
    });

    return Response.json({
      status: 200,
      message: "Berhasil ambil semua data!",
      data: forumDiskusi,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 400, message: "Something went wrong!" });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const forumDiskusi = await prisma.forumDiskusi.create({
      data: {
        title: data.title,
        kategori: data.kategori,
        content: data.content,
        postedAt: data.postedAt,
        owner: {
          connect: {
            id: data.ownerId,
          },
        },
      },
    });

    return Response.json({
      status: 200,
      message: "Berhasil buat data!",
      data: forumDiskusi,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 400, message: "Something went wrong!" });
  }
}
