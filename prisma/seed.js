const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.account.create({
    data: {
      email : "admin@gmail.com",
      username: "admin",
      avatar: `https://ui-avatars.com/api/?name=admin`,
      password : "$2a$12$rYT6BJWBuJ28u6POeWjnJ.SlnVv/8yswsQye58OFherUlHiN04AmG",
      type: "admin",
    },
  });

  await prisma.account.create({
    data: {
      email : "tutor@gmail.com",
      username: "tutor",
      avatar: `https://ui-avatars.com/api/?name=tutor`,
      password : "$2a$12$rYT6BJWBuJ28u6POeWjnJ.SlnVv/8yswsQye58OFherUlHiN04AmG",
      type: "tutor",
    },
  });

  await prisma.account.create({
    data: {
      email : "pelajar@gmail.com",
      username: "pelajar",
      avatar: `https://ui-avatars.com/api/?name=pelajar`,
      password : "$2a$12$rYT6BJWBuJ28u6POeWjnJ.SlnVv/8yswsQye58OFherUlHiN04AmG",
      type: "pelajar",
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
