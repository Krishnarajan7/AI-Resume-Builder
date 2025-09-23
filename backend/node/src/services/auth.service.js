import prisma from "../config/db.js";

export async function rotateRefreshToken(userId, oldToken, newToken) {
  await prisma.session.deleteMany({ where: { sessionToken: oldToken } });
  await prisma.session.create({
    data: {
      userId,
      sessionToken: newToken,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
}

export async function invalidateAllSessions(userId) {
  await prisma.session.deleteMany({ where: { userId } });
}