import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = Number(searchParams.get("productId"));
  if (!productId) {
    return NextResponse.json({ message: "Invalid productId" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { productId, rating, comment } = body ?? {};
  const numericRating = Number(rating);
  const id = Number(productId);

  if (!id || !numericRating || numericRating < 1 || numericRating > 5 || !comment) {
    return NextResponse.json({ message: "Invalid review data" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const user = await getUserFromToken(token);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const review = await prisma.review.create({
    data: {
      rating: numericRating,
      comment: String(comment),
      name: user.name ?? user.phone,
      productId: id,
      userId: user.id,
    },
  });

  return NextResponse.json(review);
}
