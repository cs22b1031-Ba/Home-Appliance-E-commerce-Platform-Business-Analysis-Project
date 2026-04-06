import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const products = await prisma.product.findMany({
    where: category
      ? {
          category: {
            slug: category,
          },
        }
      : undefined,
    include: { images: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
