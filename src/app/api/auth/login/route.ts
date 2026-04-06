import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { phone, password } = body ?? {};

  if (!phone || !password) {
    return NextResponse.json(
      { message: "Phone and password are required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const valid = await verifyPassword(String(password), user.passwordHash);
  if (!valid) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const session = await createSession(user.id);
  const response = NextResponse.json({ userId: user.id });
  response.cookies.set("session_token", session.token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
