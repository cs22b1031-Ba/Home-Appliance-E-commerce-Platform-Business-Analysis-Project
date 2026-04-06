"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotalCents, saveForLater } = useCart();

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-12">
      <h1 className="text-4xl font-semibold">Your cart</h1>
      <p className="mt-2 text-sm text-[var(--umber)]">
        Curate your home narrative before checkout.
      </p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-white/60 bg-white/70 p-10 text-center">
          <p className="text-lg">Your cart is empty.</p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white"
          >
            Browse collections
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-3xl border border-white/60 bg-white/70 p-6 md:flex-row md:items-center"
              >
                <img
                  src={item.image ?? "/placeholder.svg"}
                  alt={item.name}
                  className="h-32 w-32 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-[var(--umber)]">
                    {formatPrice(item.priceCents)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-9 w-9 rounded-full border border-[rgba(90,70,52,0.2)]"
                  >
                    -
                  </button>
                  <span className="min-w-[32px] text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-9 w-9 rounded-full border border-[rgba(90,70,52,0.2)]"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-sm text-[var(--umber)]"
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => {
                    saveForLater(item);
                    removeItem(item.id);
                  }}
                  className="text-sm font-semibold text-[var(--umber)]"
                >
                  Save for later
                </button>
              </div>
            ))}
          </div>
          <div className="h-fit rounded-3xl border border-white/60 bg-white/80 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--umber)]">
              Summary
            </p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-semibold text-[var(--ink)]">
                {formatPrice(subtotalCents)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span>Delivery</span>
              <span className="text-[var(--umber)]">Calculated at checkout</span>
            </div>
            <div className="mt-6 border-t border-[rgba(90,70,52,0.2)] pt-6">
              <Link
                href="/checkout"
                className="block rounded-full bg-[var(--ink)] px-6 py-3 text-center text-sm font-semibold text-white"
              >
                Proceed to checkout
              </Link>
              <p className="mt-3 text-xs text-[var(--umber)]">
                Taxes and delivery fees will be calculated based on location.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
