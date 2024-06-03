import prisma from "@/utils/prisma";

export async function PATCH(req) {
  try {
    const id = req.url.split("/checkout/")[1];
    const data = await req.json();

    const kelas = await prisma.kelas.update({
      where: {
        id: parseInt(id),
      },
      data: {
        siswa: {
          connect: { id: data.userId },
        },
      },
    });

    return Response.json({
      status: 200,
      message: "Berhasil ubah data!",
      data: kelas,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 400, message: "Something went wrong!" });
  }
}
