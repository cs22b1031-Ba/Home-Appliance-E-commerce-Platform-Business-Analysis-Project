import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const assertAdmin = (request: Request) => {
  const token = request.headers.get("x-admin-token");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return false;
  }
  return true;
};

export async function GET(request: Request) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, slug, description, image } = body ?? {};

  if (!name || !slug) {
    return NextResponse.json(
      { message: "Name and slug are required" },
      { status: 400 }
    );
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
      image,
    },
  });

  return NextResponse.json(category);
}
