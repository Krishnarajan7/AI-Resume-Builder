import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    if (!user.username) {
      const username = user.email.split("@")[0];
      await prisma.user.update({
        where: { id: user.id },
        data: { username },
      });
      console.log(`Updated user ${user.email} -> username: ${username}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
