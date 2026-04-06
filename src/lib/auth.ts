import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const SESSION_TTL_DAYS = 30;

export const hashPassword = async (password: string) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = await new Promise<string>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => {
      if (err) reject(err);
      resolve(key.toString("hex"));
    });
  });
  return `${salt}:${derived}`;
};

export const verifyPassword = async (password: string, stored: string) => {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = await new Promise<string>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => {
      if (err) reject(err);
      resolve(key.toString("hex"));
    });
  });
  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(derived, "hex")
  );
};

export const createSession = async (userId: number) => {
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_TTL_DAYS);
  const session = await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
  return session;
};

export const getUserFromToken = async (token: string | undefined | null) => {
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { token } });
    return null;
  }
  return session.user;
};
