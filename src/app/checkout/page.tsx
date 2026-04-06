"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";
import QRCode from "qrcode";

const initialForm = {
  name: "",
  email: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  upiReference: "",
};

export default function CheckoutPage() {
  const { items, subtotalCents, clear } = useCart();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<null | {
    id: number;
    phone: string;
    email: string;
    name?: string | null;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  }>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const upfrontCents = Math.max(0, Math.round(subtotalCents * 0.1));
  const codCents = Math.max(0, subtotalCents - upfrontCents);
  const upiId = process.env.NEXT_PUBLIC_UPI_ID ?? "";
  const upiName = process.env.NEXT_PUBLIC_UPI_NAME ?? "Lunor Atelier";

  const upiUri = useMemo(() => {
    if (!upiId) return "";
    const params = new URLSearchParams({
      pa: upiId,
      pn: upiName,
      am: (upfrontCents / 100).toFixed(2),
      cu: "INR",
      tn: "10% advance payment",
    });
    return `upi://pay?${params.toString()}`;
  }, [upiId, upiName, upfrontCents]);

  useEffect(() => {
    const loadUser = async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!data?.user) {
        window.location.href = "/auth";
        return;
      }
      setUser(data.user);
      setForm((prev) => ({
        ...prev,
        name: data.user.name ?? "",
        email: data.user.email ?? "",
        address: data.user.address ?? "",
        city: data.user.city ?? "",
        state: data.user.state ?? "",
        postalCode: data.user.postalCode ?? "",
      }));
    };
    loadUser();
  }, []);

  useEffect(() => {
    const buildQr = async () => {
      if (!upiUri) {
        setQrDataUrl("");
        return;
      }
      try {
        const dataUrl = await QRCode.toDataURL(upiUri, { width: 220 });
        setQrDataUrl(dataUrl);
      } catch {
        setQrDataUrl("");
      }
    };
    buildQr();
  }, [upiUri]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items,
          upfrontCents,
          codCents,
        }),
      });

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      setStatus("success");
      setMessage(
        "Order placed. Pay 10% via UPI now and 90% on delivery. Your dashboard will update once payment is verified."
      );
      clear();
      setForm((prev) => ({ ...prev, upiReference: "" }));
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-semibold">Checkout</h1>
          <p className="mt-2 text-sm text-[var(--umber)]">
            Complete your order with white-glove delivery.
          </p>
        </div>
        <div className="rounded-2xl border border-white/60 bg-white/70 px-6 py-4 text-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--umber)]">
            Order total
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {formatPrice(subtotalCents)}
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <form
          onSubmit={onSubmit}
          className="space-y-6 rounded-3xl border border-white/60 bg-white/70 p-8"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              Full name
              <input
                required
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, email: event.target.value }))
                }
                className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
              />
            </label>
          </div>
          <label className="flex flex-col gap-2 text-sm">
            Address
            <input
              required
              value={form.address}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, address: event.target.value }))
              }
              className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm">
              City
              <input
                required
                value={form.city}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, city: event.target.value }))
                }
                className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              State
              <input
                required
                value={form.state}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, state: event.target.value }))
                }
                className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Postal code
              <input
                required
                value={form.postalCode}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, postalCode: event.target.value }))
                }
                className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
              />
            </label>
          </div>
          <div className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/80 p-4 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--umber)]">
              Payment rule
            </p>
            <p className="mt-2 text-sm text-[var(--umber)]">
              Pay 10% online via UPI now, 90% cash on delivery.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--umber)]">
                  Pay now (10%)
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {formatPrice(upfrontCents)}
                </p>
              </div>
              <div className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--umber)]">
                  Pay on delivery (90%)
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {formatPrice(codCents)}
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-dashed border-[rgba(90,70,52,0.3)] bg-white/80 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--umber)]">
                UPI ID
              </p>
              <p className="mt-1 text-sm font-semibold">
                {upiId || "Set NEXT_PUBLIC_UPI_ID"}
              </p>
              {qrDataUrl ? (
                <div className="mt-3 flex flex-col items-center gap-3">
                  <a
                    href={upiUri}
                    className="inline-flex rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white p-2"
                  >
                    <img
                      src={qrDataUrl}
                      alt="UPI QR code"
                      className="h-48 w-48 rounded-2xl"
                    />
                  </a>
                  <a
                    href={upiUri}
                    className="text-xs font-semibold text-[var(--umber)] underline"
                  >
                    Open UPI app
                  </a>
                </div>
              ) : null}
              <p className="mt-3 text-xs text-[var(--umber)]">
                Scan the QR to pay {formatPrice(upfrontCents)} as the 10% advance.
              </p>
            </div>
            
          </div>
          <button
            type="submit"
            disabled={items.length === 0 || status === "loading"}
            className="w-full rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {status === "loading" ? "Processing..." : "Place order"}
          </button>
          {message ? (
            <p className="text-sm text-[var(--umber)]">{message}</p>
          ) : null}
        </form>

        <div className="h-fit rounded-3xl border border-white/60 bg-white/70 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--umber)]">
            Items
          </p>
          <div className="mt-4 space-y-4">
            {items.length === 0 ? (
              <p className="text-sm text-[var(--umber)]">Your cart is empty.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.image ?? "/placeholder.svg"}
                    alt={item.name}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-[var(--umber)]">
                      {item.quantity} × {formatPrice(item.priceCents)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatPrice(item.priceCents * item.quantity)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
