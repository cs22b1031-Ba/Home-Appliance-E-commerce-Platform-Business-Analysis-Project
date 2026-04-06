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

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    productsCount,
    categoriesCount,
    ordersCount,
    revenue,
    recentOrders,
    recentProducts,
    lowStock,
    recentOrdersCount,
    pendingOrdersCount,
    yearlyOrders,
    monthlyOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalCents: true },
      where: { status: "completed" },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        email: true,
        totalCents: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.product.findMany({
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        priceCents: true,
        stock: true,
        updatedAt: true,
      },
    }),
    prisma.product.findMany({
      where: { stock: { lte: 5 } },
      orderBy: { stock: "asc" },
      take: 6,
      select: { id: true, name: true, stock: true },
    }),
    prisma.order.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    }),
    prisma.order.count({
      where: { status: "processing" },
    }),
    prisma.$queryRaw<
      { year: string; orders: number; revenue: number | null }[]
    >`SELECT strftime('%Y', createdAt) as year,
         COUNT(*) as orders,
         SUM(CASE WHEN status = 'completed' THEN totalCents ELSE 0 END) as revenue
       FROM "Order"
       GROUP BY year
       ORDER BY year DESC`,
    prisma.$queryRaw<
      { month: string; orders: number; revenue: number | null }[]
    >`SELECT strftime('%Y-%m', createdAt) as month,
         COUNT(*) as orders,
         SUM(CASE WHEN status = 'completed' THEN totalCents ELSE 0 END) as revenue
       FROM "Order"
       GROUP BY month
       ORDER BY month DESC`,
  ]);

  return NextResponse.json({
    productsCount,
    categoriesCount,
    ordersCount,
    revenueCents: revenue._sum.totalCents ?? 0,
    recentOrders,
    recentProducts,
    lowStock,
    recentOrdersCount,
    pendingOrdersCount,
    yearlyOrders: yearlyOrders.map((row) => ({
      year: row.year,
      orders: Number(row.orders ?? 0),
      revenueCents: Number(row.revenue ?? 0),
    })),
    monthlyOrders: monthlyOrders.map((row) => ({
      month: row.month,
      orders: Number(row.orders ?? 0),
      revenueCents: Number(row.revenue ?? 0),
    })),
  });
}
