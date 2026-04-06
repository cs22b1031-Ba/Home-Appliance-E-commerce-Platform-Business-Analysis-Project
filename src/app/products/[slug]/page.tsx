import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import AddToCart from "@/components/add-to-cart";
import SaveForLater from "@/components/save-for-later";
import { getPrimaryImageUrl } from "@/lib/media";
import ProductMediaGallery from "@/components/product-media-gallery";
import { readHomepageContent } from "@/lib/homepage-content";
import ReviewsPanel from "@/components/reviews-panel";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const [product, homepage] = await Promise.all([
    prisma.product.findUnique({
      where: { slug: resolvedParams.slug },
      include: { images: true, category: true },
    }),
    readHomepageContent(),
  ]);

  if (!product) {
    notFound();
  }

  const cartImage = getPrimaryImageUrl(product.images);
  const pledgeEnabled = Boolean(product.showPledge) || homepage.showPledge;
  const pledgeTitle = product.pledgeTitle || homepage.pledgeTitle;
  const pledgeText = product.pledgeText || homepage.pledgeText;

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-12">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <ProductMediaGallery media={product.images} productName={product.name} />
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--umber)]">
            {product.category.name}
          </p>
          <h1 className="text-4xl font-semibold">{product.name}</h1>
          <p className="text-sm text-[var(--umber)]">{product.description}</p>
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-semibold text-[var(--ink)]">
              {formatPrice(product.priceCents)}
            </span>
            {product.compareAtCents ? (
              <span className="text-sm text-[var(--skyline)] line-through">
                {formatPrice(product.compareAtCents)}
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-3">
            <AddToCart
              id={product.id}
              name={product.name}
              priceCents={product.priceCents}
              image={cartImage}
            />
            <SaveForLater
              id={product.id}
              name={product.name}
              priceCents={product.priceCents}
              image={cartImage}
            />
          </div>
          <div className="grid gap-4 rounded-2xl border border-white/60 bg-white/70 p-5 text-sm text-[var(--umber)]">
            <div className="flex items-center justify-between">
              <span>Material</span>
              <span className="text-[var(--ink)]">{product.material ?? "Signature blend"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Dimensions</span>
              <span className="text-[var(--ink)]">{product.dimensions ?? "Custom"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Warranty</span>
              <span className="text-[var(--ink)]">{product.warranty ?? "Standard"}</span>
            </div>
            {product.energyRating ? (
              <div className="flex items-center justify-between">
                <span>Energy rating</span>
                <span className="text-[var(--ink)]">{product.energyRating}</span>
              </div>
            ) : null}
          </div>
          {pledgeEnabled ? (
            <div className="rounded-2xl bg-[var(--night)] p-6 text-sm text-[rgba(232,224,211,0.8)]">
              <p className="text-xs uppercase tracking-[0.2em]">
                {pledgeTitle}
              </p>
              <p className="mt-3">{pledgeText}</p>
            </div>
          ) : null}
        </div>
      </div>
      <div className="mt-10">
        <ReviewsPanel productId={product.id} />
      </div>
    </main>
  );
}
