import Link from "next/link";
import { formatPrice } from "@/lib/format";
import ProductCardCarousel from "@/components/product-card-carousel";

export type ProductCardProps = {
  slug: string;
  name: string;
  priceCents: number;
  compareAtCents?: number | null;
  rating: number;
  reviewCount: number;
  images: string[];
};

export default function ProductCard({
  slug,
  name,
  priceCents,
  compareAtCents,
  rating,
  reviewCount,
  images,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/70 transition hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(15,15,15,0.14)]"
    >
      <ProductCardCarousel images={images} name={name} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[var(--umber)]">
          <span>Signature</span>
          <span>
            {rating.toFixed(1)} · {reviewCount} reviews
          </span>
        </div>
        <h3 className="text-lg font-semibold text-[var(--ink)]">{name}</h3>
        <div className="mt-auto flex items-center gap-3">
          <span className="text-lg font-semibold text-[var(--ink)]">
            {formatPrice(priceCents)}
          </span>
          {compareAtCents ? (
            <span className="text-sm text-[var(--skyline)] line-through">
              {formatPrice(compareAtCents)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
