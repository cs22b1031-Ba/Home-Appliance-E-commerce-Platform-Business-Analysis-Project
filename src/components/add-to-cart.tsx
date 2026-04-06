"use client";

import { useCart } from "@/components/cart-provider";
import { useToast } from "@/components/toast-provider";

type AddToCartProps = {
  id: number;
  name: string;
  priceCents: number;
  image?: string | null;
};

export default function AddToCart({ id, name, priceCents, image }: AddToCartProps) {
  const { addItem } = useCart();
  const { pushToast } = useToast();

  return (
    <button
      type="button"
      onClick={() => {
        addItem({ id, name, priceCents, image }, 1);
        pushToast("Added to cart");
      }}
      className="rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--umber)]"
    >
      Add to cart
    </button>
  );
}
