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
  const categoryId = Number(id);
  if (!categoryId) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const body = await request.json();
  const { name, slug, description, image } = body ?? {};

  try {
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        slug,
        description,
        image,
      },
    });
    return NextResponse.json(category);
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
  const categoryId = Number(id);
  if (!categoryId) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const productCount = await prisma.product.count({ where: { categoryId } });
  if (productCount > 0) {
    return NextResponse.json(
      { message: "Delete products in this category first" },
      { status: 400 }
    );
  }

  try {
    await prisma.category.delete({ where: { id: categoryId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Delete failed" }, { status: 400 });
  }
}
