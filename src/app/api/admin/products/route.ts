import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const assertAdmin = (request: Request) => {
  const token = request.headers.get("x-admin-token");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return false;
  }
  return true;
};

export async function POST(request: Request) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    name,
    slug,
    description,
    priceCents,
    compareAtCents,
    rating,
    reviewCount,
    stock,
    featured,
    material,
    dimensions,
    warranty,
    energyRating,
    showPledge,
    pledgeTitle,
    pledgeText,
    categoryId,
    images,
  } = body ?? {};

  if (!name || !slug || !description || priceCents === undefined || !categoryId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      priceCents: Number(priceCents),
      compareAtCents: compareAtCents ? Number(compareAtCents) : null,
      rating: rating ? Number(rating) : 4.7,
      reviewCount: reviewCount ? Number(reviewCount) : 120,
      stock: stock ? Number(stock) : 20,
      featured: Boolean(featured),
      material: material || null,
      dimensions: dimensions || null,
      warranty: warranty || null,
      energyRating: energyRating || null,
      showPledge: Boolean(showPledge),
      pledgeTitle: pledgeTitle || null,
      pledgeText: pledgeText || null,
      categoryId: Number(categoryId),
      images: Array.isArray(images)
        ? {
            create: images
              .filter((url: string) => Boolean(url))
              .map((url: string, index: number) => ({
                url,
                alt: name,
                isPrimary: index === 0,
              })),
          }
        : undefined,
    },
    include: { images: true },
  });

  return NextResponse.json(product);
}

export async function GET(request: Request) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    include: { images: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
