import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const user = await getUserFromToken(token);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      phone: user.phone,
      email: user.email,
      name: user.name,
      address: user.address,
      city: user.city,
      state: user.state,
      postalCode: user.postalCode,
    },
  });
}
