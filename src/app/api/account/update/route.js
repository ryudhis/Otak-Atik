import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";

const validatePassword = async (password1, password2) => {
  return bcrypt.compareSync(password1, password2);
};

export async function PATCH(req) {
  try {
    const data = await req.json();
    const { id, oldPassword, newPassword, ...rest } = data;

    let updateData = { ...rest };

    if (oldPassword && newPassword) {
      const account = await prisma.account.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (!account) {
        return new Response(
          JSON.stringify({ status: 400, message: "Account not found!" }),
          { status: 400 }
        );
      }

      const isValidPassword = await validatePassword(
        oldPassword,
        account.password
      );
      if (!isValidPassword) {
        return new Response(
          JSON.stringify({
            status: 400,
            message: "Password Lama Salah!",
          }),
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData = {
        ...updateData,
        password: hashedPassword,
      };
    }

    // Check if updateData includes username attribute
    if (updateData.hasOwnProperty("username")) {
      const avatarUrl = `https://ui-avatars.com/api/?name=${updateData.username}&size=32&rounded=true&background=random`;
      updateData = {
        ...updateData,
        avatar: avatarUrl,
      };
    }

    const updatedAccount = await prisma.account.update({
      where: {
        id: parseInt(id),
      },
      data: updateData,
    });

    return new Response(
      JSON.stringify({
        status: 200,
        message: "Account data updated successfully!",
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
