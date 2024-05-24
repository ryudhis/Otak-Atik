import prisma from "@/utils/prisma";

export async function GET() {
  try {
    const commentKelas = await prisma.commentKelas.findMany();

    return Response.json({
      status: 200,
      message: "Berhasil ambil semua data!",
      data: commentKelas,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 400, message: "Something went wrong!" });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const commentKelas = await prisma.commentKelas.create({
      data: {
        content: data.content,
        postedAt: data.postedAt,
        owner: {
          connect: {
            id: data.ownerId,
          },
        },
        kelas: {
          connect: {
            id: data.kelasId,
          },
        },
      },
    });

    return Response.json({
      status: 200,
      message: "Berhasil buat data!",
      data: commentKelas,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 400, message: "Something went wrong!" });
  }
}
