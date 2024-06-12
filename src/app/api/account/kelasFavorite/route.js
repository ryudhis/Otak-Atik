import prisma from "@/utils/prisma";

export async function PATCH(req) {
  try {
    const data = await req.json();

    // Fetch the user data
    const dataUser = await prisma.account.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!dataUser) {
      return new Response(
        JSON.stringify({ status: 404, message: "User not found!" }),
        { status: 404 }
      );
    }

    // Update kelasFavorite
    let updatedKelasFavorite;
    if (dataUser.kelasFavorite.includes(data.kelasId)) {
      updatedKelasFavorite = dataUser.kelasFavorite.filter((id) => id !== data.kelasId);
    } else {
      updatedKelasFavorite = [data.kelasId, ...dataUser.kelasFavorite];
    }

    // Update account
    const updatedAccount = await prisma.account.update({
      where: {
        id: data.userId,
      },
      data: {
        kelasFavorite: updatedKelasFavorite,
      },
    });

    return new Response(
      JSON.stringify({
        status: 200,
        message: "Berhasil ubah data!",
        data: updatedAccount,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ status: 400, message: "Something went wrong!" }),
      { status: 400 }
    );
  }
}
