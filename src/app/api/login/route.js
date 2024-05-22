import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";
import * as jose from "jose";

const signToken = async (account) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const payload = {
    id: account.id,  // Include user ID in the payload
    username: account.username,
    type: account.type
  };

  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);
};

const validatePassword = async (password1, password2) => {
  return bcrypt.compareSync(password1, password2);
};

export async function POST(req) {
  const { username, password } = await req.json();

  try {
    const account = await prisma.account.findUnique({
      where: {
        username,
      },
    });

    if (account) {
      const validate = await validatePassword(password, account.password);
      if (validate) {
        const token = await signToken(account);
        return new Response(
          JSON.stringify({
            status: 200,
            token,
            message: "Berhasil Login!",
          }),
          { status: 200 }
        );
      } else {
        return new Response(
          JSON.stringify({ status: 400, message: "Password Salah!" }),
          { status: 400 }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ status: 400, message: "Account tidak ditemukan!" }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ status: 400, message: "Something went wrong!" }),
      { status: 400 }
    );
  }
}
