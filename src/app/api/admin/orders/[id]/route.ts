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

  const body = await request.json();
  const status = body?.status ? String(body.status).toLowerCase() : null;
  const paymentStatus = body?.paymentStatus
    ? String(body.paymentStatus).toLowerCase()
    : null;
  const deliveryStatus = body?.deliveryStatus
    ? String(body.deliveryStatus).toLowerCase()
    : null;
  const deliveryLocation = body?.deliveryLocation
    ? String(body.deliveryLocation)
    : null;

  const allowedStatus = new Set(["processing", "completed", "cancelled"]);
  const allowedPayment = new Set(["pending_upi", "paid_upi_10", "failed_upi"]);
  const allowedDelivery = new Set([
    "processing",
    "packed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ]);

  if (status && !allowedStatus.has(status)) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }
  if (paymentStatus && !allowedPayment.has(paymentStatus)) {
    return NextResponse.json({ message: "Invalid payment status" }, { status: 400 });
  }
  if (deliveryStatus && !allowedDelivery.has(deliveryStatus)) {
    return NextResponse.json(
      { message: "Invalid delivery status" },
      { status: 400 }
    );
  }

  const resolvedParams = await params;
  const orderId = Number(resolvedParams.id);
  if (!orderId) {
    return NextResponse.json({ message: "Invalid order id" }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      ...(status ? { status } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
      ...(deliveryStatus ? { deliveryStatus } : {}),
      ...(deliveryLocation ? { deliveryLocation } : {}),
    },
  });

  return NextResponse.json(updated);
}
