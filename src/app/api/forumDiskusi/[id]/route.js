import prisma from "@/utils/prisma";

export async function GET(req) {
  try {
    const id = req.url.split("/forumDiskusi/")[1];
    const forumDiskusi = await prisma.forumDiskusi.findUnique({
      where: {
        id:parseInt(id),
      },
      include: {
        owner: true,
        commentKelas: true,
      },
    });

    return Response.json({
      status: 200,
      message: "Berhasil ambil data!",
      data: forumDiskusi,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 400, message: "Something went wrong!" });
  }
}

export async function DELETE(req) {
  try {
    const id = req.url.split("/forumDiskusi/")[1];
    const forumDiskusi = await prisma.forumDiskusi.delete({
      where: {
        id,
      },
    });

    return Response.json({
      status: 200,
      message: "Berhasil hapus data!",
      data: forumDiskusi,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 400, message: "Something went wrong!" });
  }
}

export async function PATCH(req) {
  try {
    const id = req.url.split("/forumDiskusi/")[1];
    const data = await req.json();

    const forumDiskusi = await prisma.forumDiskusi.update({
      where: {
        id,
      },
      data,
    });

    return Response.json({
      status: 200,
      message: "Berhasil ubah data!",
      data: forumDiskusi,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 400, message: "Something went wrong!" });
  }
}
