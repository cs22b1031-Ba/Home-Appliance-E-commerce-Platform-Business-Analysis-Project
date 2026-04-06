"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/format";

type Overview = {
  productsCount: number;
  categoriesCount: number;
  ordersCount: number;
  revenueCents: number;
  recentOrdersCount: number;
  pendingOrdersCount: number;
  recentOrders: {
    id: number;
    name: string;
    email: string;
    totalCents: number;
    status: string;
    createdAt: string;
  }[];
  recentProducts: {
    id: number;
    name: string;
    priceCents: number;
    stock: number;
    updatedAt: string;
  }[];
  lowStock: {
    id: number;
    name: string;
    stock: number;
  }[];
  yearlyOrders: {
    year: string;
    orders: number;
    revenueCents: number;
  }[];
  monthlyOrders: {
    month: string;
    orders: number;
    revenueCents: number;
  }[];
};

const emptyOverview: Overview = {
  productsCount: 0,
  categoriesCount: 0,
  ordersCount: 0,
  revenueCents: 0,
  recentOrdersCount: 0,
  pendingOrdersCount: 0,
  recentOrders: [],
  recentProducts: [],
  lowStock: [],
  yearlyOrders: [],
  monthlyOrders: [],
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

function AdminOverviewPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [overview, setOverview] = useState<Overview>(emptyOverview);
  const [status, setStatus] = useState("");
  const [orderStatuses, setOrderStatuses] = useState<Record<number, string>>({});
  const [savingOrderId, setSavingOrderId] = useState<number | null>(null);

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-admin-token": token,
    }),
    [token]
  );

  const loadOverview = async () => {
    if (!token) return;
    setStatus("Loading overview...");

    const res = await fetch("/api/admin/overview", { headers });
    if (!res.ok) {
      setStatus("Token invalid or API failed.");
      return;
    }

    const payload = await res.json();
    setOverview(payload);
    const statusMap: Record<number, string> = {};
    payload.recentOrders?.forEach((order: Overview["recentOrders"][number]) => {
      statusMap[order.id] = order.status;
    });
    setOrderStatuses(statusMap);
    setStatus("");
  };

  const saveOrderStatus = async (orderId: number, nextStatus: string) => {
    setSavingOrderId(orderId);
    setStatus("Updating order...");
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status: nextStatus }),
    });
    if (!res.ok) {
      try {
        const payload = await res.json();
        setStatus(payload.message ?? "Failed to update order.");
      } catch {
        setStatus("Failed to update order.");
      }
      setSavingOrderId(null);
      return;
    }
    await loadOverview();
    setSavingOrderId(null);
    setStatus("Order updated.");
  };

  useEffect(() => {
    loadOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Admin overview</h1>
        <p className="mt-4 text-sm text-[var(--umber)]">
          Open this page as:
          <code className="ml-2 rounded bg-white/70 px-2 py-1">
            /admin/overview?token=YOUR_ADMIN_TOKEN
          </code>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Admin overview</h1>
          <p className="mt-1 text-sm text-[var(--umber)]">
            Track store health, orders, and inventory at a glance.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin?token=${token}`}
            className="rounded-full border border-[rgba(90,70,52,0.3)] px-5 py-2 text-sm font-semibold text-[var(--umber)]"
          >
            Manage content
          </Link>
          <Link
            href={`/admin/orders?token=${token}`}
            className="rounded-full border border-[rgba(90,70,52,0.3)] px-5 py-2 text-sm font-semibold text-[var(--umber)]"
          >
            Manage orders
          </Link>
          <button
            type="button"
            onClick={loadOverview}
            className="rounded-full bg-[var(--ink)] px-5 py-2 text-sm font-semibold text-white"
          >
            Refresh
          </button>
        </div>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-white/60 bg-white/70 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--umber)]">
            Revenue
          </p>
          <p className="mt-3 text-2xl font-semibold">
            {formatPrice(overview.revenueCents)}
          </p>
          <p className="mt-2 text-xs text-[var(--umber)]">
            Total completed orders
          </p>
        </div>
        <div className="rounded-3xl border border-white/60 bg-white/70 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--umber)]">
            Orders
          </p>
          <p className="mt-3 text-2xl font-semibold">{overview.ordersCount}</p>
          <p className="mt-2 text-xs text-[var(--umber)]">
            {overview.recentOrdersCount} placed in 7 days
          </p>
        </div>
        <div className="rounded-3xl border border-white/60 bg-white/70 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--umber)]">
            Products
          </p>
          <p className="mt-3 text-2xl font-semibold">{overview.productsCount}</p>
          <p className="mt-2 text-xs text-[var(--umber)]">
            {overview.categoriesCount} categories
          </p>
        </div>
        <div className="rounded-3xl border border-white/60 bg-white/70 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--umber)]">
            Pending
          </p>
          <p className="mt-3 text-2xl font-semibold">
            {overview.pendingOrdersCount}
          </p>
          <p className="mt-2 text-xs text-[var(--umber)]">Processing orders</p>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-white/60 bg-white/70 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Yearly collections</h2>
          <span className="text-xs text-[var(--umber)]">Orders and revenue</span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {overview.yearlyOrders.length === 0 ? (
            <p className="text-sm text-[var(--umber)]">No yearly data yet.</p>
          ) : (
            overview.yearlyOrders.map((yearly) => (
              <div
                key={yearly.year}
                className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 p-4"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--umber)]">
                  {yearly.year}
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {formatPrice(yearly.revenueCents)}
                </p>
                <p className="text-xs text-[var(--umber)]">
                  {yearly.orders} orders
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-white/60 bg-white/70 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Monthly collections</h2>
          <span className="text-xs text-[var(--umber)]">Orders and revenue</span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {overview.monthlyOrders.length === 0 ? (
            <p className="text-sm text-[var(--umber)]">No monthly data yet.</p>
          ) : (
            overview.monthlyOrders.map((month) => (
              <div
                key={month.month}
                className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 p-4"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--umber)]">
                  {month.month}
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {formatPrice(month.revenueCents)}
                </p>
                <p className="text-xs text-[var(--umber)]">
                  {month.orders} orders
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-white/60 bg-white/70 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent orders</h2>
            <span className="text-xs text-[var(--umber)]">
              Latest 6 orders
            </span>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {overview.recentOrders.length === 0 ? (
              <p className="text-[var(--umber)]">No orders yet.</p>
            ) : (
              overview.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold">{order.name}</p>
                    <p className="text-xs text-[var(--umber)]">{order.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatPrice(order.totalCents)}
                    </p>
                    <p className="text-xs text-[var(--umber)]">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={orderStatuses[order.id] ?? order.status}
                      onChange={(e) => {
                        const nextStatus = e.target.value;
                        setOrderStatuses((prev) => ({
                          ...prev,
                          [order.id]: nextStatus,
                        }));
                        saveOrderStatus(order.id, nextStatus);
                      }}
                      disabled={savingOrderId === order.id}
                      className="rounded-full border border-[rgba(90,70,52,0.3)] bg-white px-3 py-1 text-xs text-[var(--umber)]"
                    >
                      <option value="processing">processing</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <div className="space-y-8">
          <section className="rounded-3xl border border-white/60 bg-white/70 p-6">
            <h2 className="text-lg font-semibold">Low stock</h2>
            <div className="mt-4 space-y-3 text-sm">
              {overview.lowStock.length === 0 ? (
                <p className="text-[var(--umber)]">No low stock items.</p>
              ) : (
                overview.lowStock.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
                  >
                    <p className="font-semibold">{item.name}</p>
                    <span className="text-xs text-[var(--umber)]">
                      {item.stock} left
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-white/60 bg-white/70 p-6">
            <h2 className="text-lg font-semibold">Recently updated</h2>
            <div className="mt-4 space-y-3 text-sm">
              {overview.recentProducts.length === 0 ? (
                <p className="text-[var(--umber)]">No products yet.</p>
              ) : (
                overview.recentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-xs text-[var(--umber)]">
                        {formatPrice(product.priceCents)}
                      </p>
                    </div>
                    <div className="text-right text-xs text-[var(--umber)]">
                      <p>{product.stock} in stock</p>
                      <p>{formatDate(product.updatedAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      {status ? (
        <p className="mt-6 text-sm text-[var(--umber)]">{status}</p>
      ) : null}
    </main>
  );
}

export default function AdminOverviewPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm text-[var(--umber)]">Loading admin overview...</p>
        </main>
      }
    >
      <AdminOverviewPageContent />
    </Suspense>
  );
}
