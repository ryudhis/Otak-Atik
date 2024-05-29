import prisma from "@/utils/prisma";

export async function PATCH(req) {
  try {
    const data = await req.json();

    const account = await prisma.account.update({
      where: {
        id: data.ownerId,
      },
      data,
    });

    return Response.json({
      status: 200,
      message: "Berhasil ubah data!",
      data: account,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 400, message: "Something went wrong!" });
  }
}
