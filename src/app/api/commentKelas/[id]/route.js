import prisma from "@/utils/prisma";

export async function DELETE(req) {
  try {
    const id = req.url.split("/commentKelas/")[1];
    const comment = await prisma.commentKelas.delete({
      where: {
        id: parseInt(id),
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
