import prisma from "@/utils/prisma";

export async function GET(req) {
  try {
    const id = req.url.split("/comment/")[1];
    const comment = await prisma.comment.findUnique({
        where: {
          id,
        },
      });

    return Response.json({
      status: 200,
      message: "Berhasil ambil data!",
      data: comment,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 400, message: "Something went wrong!" });
  }
}

export async function DELETE(req) {
  try {
    const id = req.url.split("/comment/")[1];
    const comment = await prisma.comment.delete({
      where: {
        id,
      },
    });

    return Response.json({
      status: 200,
      message: "Berhasil hapus data!",
      data: comment,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 400, message: "Something went wrong!" });
  }
}

export async function PATCH(req) {
  try {
    const id = req.url.split("/comment/")[1];
    const data = await req.json();

    const comment = await prisma.comment.update({
      where: {
        id,
      },
      data,
    });

    return Response.json({
      status: 200,
      message: "Berhasil ubah data!",
      data: comment,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 400, message: "Something went wrong!" });
  }
}
