import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const assertAdmin = (request: Request) => {
  const token = request.headers.get("x-admin-token");
  return Boolean(process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN);
};

export async function GET(request: Request) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    include: {
      items: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
