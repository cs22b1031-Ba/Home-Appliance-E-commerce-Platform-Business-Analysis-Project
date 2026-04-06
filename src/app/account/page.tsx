"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

type Order = {
  id: number;
  totalCents: number;
  upfrontCents: number;
  codCents: number;
  paymentStatus: string;
  status: string;
  deliveryStatus: string;
  deliveryLocation: string | null;
  createdAt: string;
  items: {
    id: number;
    name: string;
    priceCents: number;
    quantity: number;
  }[];
};

type AccountPayload = {
  user: {
    name: string | null;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  orders: Order[];
};

const statusSteps = [
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

export default function AccountPage() {
  const [data, setData] = useState<AccountPayload | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/account");
      if (!res.ok) {
        window.location.href = "/auth";
        return;
      }
      const payload = await res.json();
      setData(payload);
    };
    load();
  }, []);

  const logout = async () => {
    setStatus("Signing out...");
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/auth";
  };

  if (!data) {
    return (
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-12">
        <p className="text-sm text-[var(--umber)]">Loading account...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold">Your dashboard</h1>
          <p className="mt-2 text-sm text-[var(--umber)]">
            Track payment and delivery progress.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/products"
            className="rounded-full border border-[rgba(90,70,52,0.3)] px-5 py-2 text-sm font-semibold text-[var(--umber)]"
          >
            Shop
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-full bg-[var(--ink)] px-5 py-2 text-sm font-semibold text-white"
          >
            Sign out
          </button>
        </div>
      </div>

      <section className="mt-8 rounded-3xl border border-white/60 bg-white/70 p-6 text-sm">
        <h2 className="text-lg font-semibold">Your details</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--umber)]">
              Name
            </p>
            <p className="text-sm">{data.user.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--umber)]">
              Phone
            </p>
            <p className="text-sm">{data.user.phone}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--umber)]">
              Email
            </p>
            <p className="text-sm">{data.user.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--umber)]">
              Address
            </p>
            <p className="text-sm">
              {data.user.address}, {data.user.city}, {data.user.state}{" "}
              {data.user.postalCode}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Orders</h2>
        {data.orders.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-white/60 bg-white/70 p-6 text-sm text-[var(--umber)]">
            No orders yet.
          </div>
        ) : (
          <div className="mt-4 space-y-6">
            {data.orders.map((order) => {
              const activeIndex = Math.max(
                0,
                statusSteps.indexOf(order.deliveryStatus)
              );
              return (
                <div
                  key={order.id}
                  className="rounded-3xl border border-white/60 bg-white/70 p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--umber)]">
                        Order #{order.id}
                      </p>
                      <p className="text-xs text-[var(--umber)]">
                        Placed {new Date(order.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {formatPrice(order.totalCents)}
                      </p>
                      <p className="text-xs text-[var(--umber)]">
                        10% paid: {formatPrice(order.upfrontCents)} | COD:{" "}
                        {formatPrice(order.codCents)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                    <div className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--umber)]">
                        Payment status
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {order.paymentStatus}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--umber)]">
                        Item location
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {order.deliveryLocation ?? "Awaiting update"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--umber)]">
                      Delivery progress
                    </p>
                    <div className="mt-3 grid gap-2 md:grid-cols-5">
                      {statusSteps.map((step, index) => (
                        <div
                          key={step}
                          className={`rounded-full px-3 py-2 text-center text-xs ${
                            index <= activeIndex
                              ? "bg-[var(--ink)] text-white"
                              : "border border-[rgba(90,70,52,0.2)] text-[var(--umber)]"
                          }`}
                        >
                          {step.replace(/_/g, " ")}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--umber)]">
                      Items
                    </p>
                    <div className="mt-3 space-y-2 text-sm">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <span>{item.name}</span>
                          <span>
                            {item.quantity} × {formatPrice(item.priceCents)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {status ? <p className="mt-6 text-sm text-[var(--umber)]">{status}</p> : null}
    </main>
  );
}
