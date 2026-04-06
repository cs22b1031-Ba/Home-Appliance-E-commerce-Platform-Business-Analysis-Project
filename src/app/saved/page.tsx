"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";

export default function SavedPage() {
  const { saved, toggleSaved, addItem } = useCart();

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-12">
      <h1 className="text-4xl font-semibold">Saved for later</h1>
      <p className="mt-2 text-sm text-[var(--umber)]">
        Items you saved will stay here until you remove them.
      </p>

      {saved.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-white/60 bg-white/70 p-10 text-center">
          <p className="text-lg">No saved items yet.</p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white"
          >
            Browse collections
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {saved.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-3xl border border-white/60 bg-white/70 p-6 md:flex-row md:items-center"
            >
              <img
                src={item.image ?? "/placeholder.svg"}
                alt={item.name}
                className="h-28 w-28 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-[var(--umber)]">
                  {formatPrice(item.priceCents)}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => addItem(item, 1)}
                  className="rounded-full bg-[var(--ink)] px-6 py-2 text-sm font-semibold text-white"
                >
                  Move to cart
                </button>
                <button
                  type="button"
                  onClick={() => toggleSaved(item)}
                  className="rounded-full border border-[var(--umber)] px-6 py-2 text-sm font-semibold text-[var(--umber)]"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
