import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const users = await prisma.user.findMany();
for (const user of users) {
  if (!user.username) {
    // Generate base username from email
    let baseUsername = user.email.split("@")[0];

    // Check for duplicates
    let username = baseUsername;
    let counter = 1;
    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { username },
    });

    console.log(`Updated user ${user.email} -> username: ${username}`);
  }
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
