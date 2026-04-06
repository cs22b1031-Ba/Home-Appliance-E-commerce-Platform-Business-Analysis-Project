import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const assertAdmin = (request: Request) => {
  const token = request.headers.get("x-admin-token");
  return Boolean(process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN);
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const productId = Number(id);
  if (!productId) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
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

  const updateData: Record<string, unknown> = {
    name,
    slug,
    description,
    priceCents: priceCents !== undefined ? Number(priceCents) : undefined,
    compareAtCents:
      compareAtCents !== undefined && compareAtCents !== ""
        ? Number(compareAtCents)
        : null,
    rating: rating !== undefined ? Number(rating) : undefined,
    reviewCount: reviewCount !== undefined ? Number(reviewCount) : undefined,
    stock: stock !== undefined ? Number(stock) : undefined,
    featured: featured !== undefined ? Boolean(featured) : undefined,
    material: material ?? null,
    dimensions: dimensions ?? null,
    warranty: warranty ?? null,
    energyRating: energyRating ?? null,
    showPledge: showPledge !== undefined ? Boolean(showPledge) : undefined,
    pledgeTitle: pledgeTitle ?? null,
    pledgeText: pledgeText ?? null,
    categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
  };

  if (Array.isArray(images)) {
    updateData.images = {
      deleteMany: {},
      create: images
        .filter((url: string) => Boolean(url))
        .map((url: string, index: number) => ({
          url,
          alt: name ?? "",
          isPrimary: index === 0,
        })),
    };
  }

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: { images: true },
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ message: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const productId = Number(id);
  if (!productId) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  try {
    await prisma.orderItem.deleteMany({ where: { productId } });
    await prisma.productImage.deleteMany({ where: { productId } });
    await prisma.product.delete({ where: { id: productId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Delete failed" }, { status: 400 });
  }
}
