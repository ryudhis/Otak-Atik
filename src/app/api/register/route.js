import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const data = await req.json();
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const account = await prisma.account.create({
      data: {
        email: data.email,
        username: data.username,
        avatar: `https://ui-avatars.com/api/?name=${data.username}&size=32&rounded=true&background=random`,
        password: hashedPassword,
        type: data.type,
      },
    });

    return new Response(
      JSON.stringify({
        status: 200,
        message: "Berhasil buat data!",
        data: account,
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