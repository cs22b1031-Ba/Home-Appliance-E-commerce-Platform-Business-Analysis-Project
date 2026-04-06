"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/format";

type Order = {
  id: number;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  totalCents: number;
  upfrontCents: number;
  codCents: number;
  paymentStatus: string;
  deliveryStatus: string;
  deliveryLocation?: string | null;
  status: string;
  items: {
    id: number;
    name: string;
    priceCents: number;
    quantity: number;
  }[];
  user?: {
    phone: string;
    email: string;
  } | null;
};

function AdminOrdersPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState("");

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-admin-token": token,
    }),
    [token]
  );

  const loadOrders = async () => {
    if (!token) return;
    setStatus("Loading orders...");
    const res = await fetch("/api/admin/orders", { headers });
    if (!res.ok) {
      setStatus("Token invalid or API failed.");
      return;
    }
    const payload = await res.json();
    setOrders(payload);
    setStatus("");
  };

  const updateOrder = async (
    id: number,
    updates: {
      paymentStatus?: string;
      deliveryStatus?: string;
      deliveryLocation?: string;
      status?: string;
    }
  ) => {
    setStatus("Updating order...");
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setStatus(payload.message ?? "Failed to update order.");
      return;
    }
    await loadOrders();
    setStatus("Order updated.");
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Admin orders</h1>
        <p className="mt-4 text-sm text-[var(--umber)]">
          Open this page as:
          <code className="ml-2 rounded bg-white/70 px-2 py-1">
            /admin/orders?token=YOUR_ADMIN_TOKEN
          </code>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Admin orders</h1>
          <p className="mt-1 text-sm text-[var(--umber)]">
            Update payment, delivery, and order status.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/overview?token=${token}`}
            className="rounded-full border border-[rgba(90,70,52,0.3)] px-5 py-2 text-sm font-semibold text-[var(--umber)]"
          >
            Back to overview
          </Link>
          <button
            type="button"
            onClick={loadOrders}
            className="rounded-full bg-[var(--ink)] px-5 py-2 text-sm font-semibold text-white"
          >
            Refresh
          </button>
        </div>
      </div>

      <section className="mt-8 rounded-3xl border border-white/60 bg-white/70 p-6">
        {orders.length === 0 ? (
          <p className="text-sm text-[var(--umber)]">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">
                      Order #{order.id} - {order.name}
                    </p>
                    <p className="text-xs text-[var(--umber)]">
                      {order.email} • {order.user?.phone ?? "No phone"} •{" "}
                      {order.address}, {order.city}, {order.state}{" "}
                      {order.postalCode}
                    </p>
                  </div>
                  <div className="text-right text-xs text-[var(--umber)]">
                    <p className="text-sm font-semibold">
                      {formatPrice(order.totalCents)}
                    </p>
                    <p>
                      UPI 10%: {formatPrice(order.upfrontCents)} | COD:{" "}
                      {formatPrice(order.codCents)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 text-xs md:grid-cols-4">
                  <select
                    value={order.paymentStatus}
                    onChange={(e) =>
                      updateOrder(order.id, { paymentStatus: e.target.value })
                    }
                    className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white px-3 py-2"
                  >
                    <option value="pending_upi">payment: pending</option>
                    <option value="paid_upi_10">payment: paid 10%</option>
                    <option value="failed_upi">payment: failed</option>
                  </select>
                  <select
                    value={order.deliveryStatus}
                    onChange={(e) =>
                      updateOrder(order.id, { deliveryStatus: e.target.value })
                    }
                    className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white px-3 py-2"
                  >
                    <option value="processing">delivery: processing</option>
                    <option value="packed">delivery: packed</option>
                    <option value="shipped">delivery: shipped</option>
                    <option value="out_for_delivery">delivery: out for delivery</option>
                    <option value="delivered">delivery: delivered</option>
                    <option value="cancelled">delivery: cancelled</option>
                  </select>
                  <input
                    defaultValue={order.deliveryLocation ?? ""}
                    placeholder="Item location update"
                    onBlur={(e) =>
                      updateOrder(order.id, { deliveryLocation: e.target.value })
                    }
                    className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white px-3 py-2"
                  />
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrder(order.id, { status: e.target.value })
                    }
                    className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white px-3 py-2"
                  >
                    <option value="processing">order: processing</option>
                    <option value="completed">order: completed</option>
                    <option value="cancelled">order: cancelled</option>
                  </select>
                </div>

                <div className="mt-3 rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white px-3 py-2 text-xs">
                  <p className="text-[var(--umber)]">Items</p>
                  <div className="mt-2 space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.name}</span>
                        <span>
                          {item.quantity} × {formatPrice(item.priceCents)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {status ? (
        <p className="mt-6 text-sm text-[var(--umber)]">{status}</p>
      ) : null}
    </main>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm text-[var(--umber)]">Loading admin orders...</p>
        </main>
      }
    >
      <AdminOrdersPageContent />
    </Suspense>
  );
}
