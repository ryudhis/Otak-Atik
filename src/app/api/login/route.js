import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";
import * as jose from "jose";

const signToken = async (account) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  delete account.password;
  return await new jose.SignJWT(account)
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);
};
const validatePassword = async (password1, password2) => {
  const validate = bcrypt.compareSync(password1, password2);
  return validate;
};

export async function POST(req) {
  const { username, password } = await req.json();
  let token;

  try {
    const account = await prisma.account.findUnique({
      where: {
        username,
      },
    });

    if (account) {
      const validate = await validatePassword(password, account.password);
      if (validate) {
        token = await signToken(account);
        return Response.json({
          status: 200,
          token,
          message: "Berhasil Login!",
        });
      } else {
        return Response.json({ status: 400, message: "Password Salah!" });
      }
    } else {
      return Response.json({ status: 400, message: "Account tidak ditemukan!" });
    }
  } catch (error) {
    console.log(error);
    return Response.json({ status: 400, message: "Something went wrong!" });
  }
}
