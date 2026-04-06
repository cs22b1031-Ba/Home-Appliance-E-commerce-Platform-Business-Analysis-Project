import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      phone,
      email,
      password,
      name,
      address,
      city,
      state,
      postalCode,
    } = body ?? {};

    if (
      !phone ||
      !email ||
      !password ||
      !address ||
      !city ||
      !state ||
      !postalCode
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json(
        { message: "Phone number already registered" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(String(password));
    const user = await prisma.user.create({
      data: {
        phone: String(phone),
        email: String(email),
        passwordHash,
        name: name ? String(name) : null,
        address: String(address),
        city: String(city),
        state: String(state),
        postalCode: String(postalCode),
        updatedAt: new Date(),
      },
    });

    const session = await createSession(user.id);
    const response = NextResponse.json({ userId: user.id });
    response.cookies.set("session_token", session.token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Signup failed. Please try again.";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
