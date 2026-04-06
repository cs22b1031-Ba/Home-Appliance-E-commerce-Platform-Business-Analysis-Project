"use client";

import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/format";
import { useToast } from "@/components/toast-provider";

type SaveForLaterProps = {
  id: number;
  name: string;
  priceCents: number;
  image?: string | null;
};

export default function SaveForLater({ id, name, priceCents, image }: SaveForLaterProps) {
  const { toggleSaved, isSaved } = useCart();
  const { pushToast } = useToast();
  const saved = isSaved(id);

  return (
    <button
      type="button"
      onClick={() => {
        toggleSaved({ id, name, priceCents, image });
        pushToast(saved ? "Removed from saved" : "Saved for later");
      }}
      className="rounded-full border border-[var(--umber)] px-6 py-3 text-sm font-semibold text-[var(--umber)]"
    >
      {saved ? "Saved" : "Save for later"}
      {saved ? ` · ${formatPrice(priceCents)}` : ""}
    </button>
  );
}
