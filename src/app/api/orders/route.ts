import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    name,
    email,
    address,
    city,
    state,
    postalCode,
    items,
    upiReference,
  } = body ?? {};

  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  const user = await getUserFromToken(token);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!name || !email || !address || !city || !state || !postalCode) {
    return NextResponse.json(
      { message: "Missing customer details" },
      { status: 400 }
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
  }

  const productIds = items.map((item: { id: number }) => item.id);
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const lineItems = items
    .map((item: { id: number; quantity: number }) => {
      const product = dbProducts.find((db) => db.id === item.id);
      if (!product) return null;
      return {
        productId: product.id,
        name: product.name,
        priceCents: product.priceCents,
        quantity: Math.max(1, Number(item.quantity) || 1),
      };
    })
    .filter(Boolean) as {
    productId: number;
    name: string;
    priceCents: number;
    quantity: number;
  }[];

  if (lineItems.length === 0) {
    return NextResponse.json({ message: "No valid items" }, { status: 400 });
  }

  const totalCents = lineItems.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  );

  const upfrontCents = Math.max(0, Math.round(totalCents * 0.1));
  const codCents = Math.max(0, totalCents - upfrontCents);

  const order = await prisma.order.create({
    data: {
      name,
      email,
      address,
      city,
      state,
      postalCode,
      totalCents,
      upfrontCents,
      codCents,
      paymentMethod: "cod_90_upi_10",
      paymentStatus: upiReference ? "paid_upi_10" : "pending_upi",
      upiReference: upiReference ? String(upiReference) : null,
      userId: user.id,
      items: {
        createMany: {
          data: lineItems,
        },
      },
    },
    include: { items: true },
  });

  return NextResponse.json({ orderId: order.id });
}
