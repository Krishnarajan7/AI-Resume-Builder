import prisma from "../config/db.js";
import bcrypt from "bcrypt";

export async function rotateRefreshToken(userId, oldToken, newToken) {
  const hashedToken = await bcrypt.hash(newToken, 12);

  // Delete old session(s) in parallel
  if (oldToken) {
    const sessions = await prisma.session.findMany({ where: { userId } });
    await Promise.all(
      sessions.map(async (session) => {
        const match = await bcrypt.compare(oldToken, session.sessionToken);
        if (match) await prisma.session.delete({ where: { id: session.id } });
      })
    );
  }

  // Store new hashed token
  await prisma.session.create({
    data: {
      userId,
      sessionToken: hashedToken,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });
}

export async function invalidateAllSessions(userId) {
  await prisma.session.deleteMany({ where: { userId } });
}

export async function findValidSession(userId, token) {
  const sessions = await prisma.session.findMany({ where: { userId } });
  for (const session of sessions) {
    const match = await bcrypt.compare(token, session.sessionToken);
    if (match && session.expires > new Date()) {
      return session;
    }
  }
  return null;
}
