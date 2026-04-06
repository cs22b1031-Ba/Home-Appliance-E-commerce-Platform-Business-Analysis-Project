import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product-card";
import { readHomepageContent } from "@/lib/homepage-content";

export default async function HomePage() {
  const [categories, latest, homepage] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      include: { images: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    readHomepageContent(),
  ]);
  const homepageIds = homepage.homepageProductIds ?? [];
  const homepageProducts =
    homepageIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: homepageIds } },
          include: { images: true },
        })
      : latest;

  return (
    <main className="pb-24">
      <section className="border-b border-white/60 bg-[var(--night)] px-6 py-3 text-center text-xs uppercase tracking-[0.25em] text-[rgba(232,224,211,0.85)]">
        {homepage.promoText}
      </section>

      <section className="relative overflow-hidden border-b border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(247,243,238,0.95))] px-6 py-8">
        <div className="absolute inset-0">
          <div className="absolute left-12 top-3 h-24 w-24 rounded-full bg-[radial-gradient(circle,var(--glow),transparent_75%)] blur-xl" />
          <div className="absolute right-16 top-10 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(31,111,92,0.18),transparent_75%)] blur-xl" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--umber)]">
            {homepage.searchTitle}
          </p>
          <form action="/products" method="get">
            <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
              <input
                type="text"
                name="query"
                placeholder="Search products or categories..."
                className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white px-4 py-3 text-sm"
              />
              <select
                name="category"
                defaultValue=""
                className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white px-4 py-3 text-sm"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-2xl bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold">{homepage.collectionsTitle}</h2>
          <Link
            href="/products"
            className="text-sm font-semibold text-[var(--umber)]"
          >
            {homepage.collectionsViewAllLabel}
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-white/50 bg-white/50 p-3"
            >
              <div className="absolute inset-0">
                <img
                  src={category.image ?? "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1200&q=80"}
                  alt={category.name}
                  className="h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(15,15,15,0.6)] via-[rgba(15,15,15,0.2)]" />
              </div>
              <div className="relative flex h-full flex-col justify-end text-white">
                <p className="text-base font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                  {category.name}
                </p>
                <h3 className="mt-1 text-[10px] text-white/80">
                  {category.description}
                </h3>
                <span className="mt-2 inline-flex items-center gap-2 text-[10px]">
                  Explore
                  <span>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden px-6 pb-24 pt-20">
        <div className="absolute inset-0">
          <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,var(--glow),transparent_70%)] blur-2xl" />
          <div className="absolute -right-20 top-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(31,111,92,0.2),transparent_70%)] blur-2xl" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--paper)]" />
          <div className="grain absolute inset-0" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--umber)]">
              {homepage.heroBadge}
            </p>
            <h1 className="text-balance text-5xl font-semibold leading-tight md:text-6xl">
              {homepage.heroTitle}
            </h1>
            <p className="max-w-xl text-base text-[var(--umber)] md:text-lg">
              {homepage.heroDescription}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={homepage.primaryCtaHref}
                className="rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white"
              >
                {homepage.primaryCtaLabel}
              </Link>
              <Link
                href={homepage.secondaryCtaHref}
                className="rounded-full border border-[var(--umber)] px-6 py-3 text-sm font-semibold text-[var(--umber)]"
              >
                {homepage.secondaryCtaLabel}
              </Link>
            </div>
            <div className="grid gap-6 pt-6 text-sm text-[var(--umber)] sm:grid-cols-3">
              <div>
                <p className="text-2xl font-semibold text-[var(--ink)]">
                  {homepage.stat1Value}
                </p>
                <p>{homepage.stat1Label}</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--ink)]">
                  {homepage.stat2Value}
                </p>
                <p>{homepage.stat2Label}</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[var(--ink)]">
                  {homepage.stat3Value}
                </p>
                <p>{homepage.stat3Label}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="glass-panel shadow-luxe relative rounded-[32px] p-6">
              <img
                src="https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury living room"
                className="h-[420px] w-full rounded-3xl object-cover"
              />
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-[var(--umber)]">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">
                    {homepage.showroomLabel}
                  </p>
                  <p className="text-lg text-[var(--ink)]">
                    {homepage.showroomTitle}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">
                    {homepage.tourLabel}
                  </p>
                  <p className="text-lg text-[var(--ink)]">{homepage.tourTitle}</p>
                </div>
              </div>
            </div>
            <div className="shadow-soft w-full rounded-3xl bg-white/80 p-4 text-sm text-[var(--umber)]">
              <p className="text-xs uppercase tracking-[0.2em]">
                {homepage.materialLabLabel}
              </p>
              <p className="mt-2 text-base text-[var(--ink)]">
                {homepage.materialLabText}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--umber)]">
              Latest arrivals
            </p>
            <h2 className="mt-2 text-3xl font-semibold">
              New in the atelier
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-[var(--umber)]"
          >
            Shop all
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {homepageProducts.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              name={product.name}
              priceCents={product.priceCents}
              compareAtCents={product.compareAtCents}
              rating={product.rating}
              reviewCount={product.reviewCount}
              images={product.images.map((image) => image.url)}
            />
          ))}
        </div>
      </section>


      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-8 rounded-3xl border border-white/60 bg-[var(--night)] p-10 text-white md:grid-cols-[1.4fr_0.6fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[rgba(232,224,211,0.7)]">
              {homepage.appointmentBadge}
            </p>
            <h2 className="mt-4 text-3xl font-semibold">
              {homepage.appointmentTitle}
            </h2>
            <p className="mt-4 text-sm text-[rgba(232,224,211,0.7)]">
              {homepage.appointmentDescription}
            </p>
          </div>
          <div className="flex flex-col justify-between gap-6">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em]">
                {homepage.availabilityLabel}
              </p>
              <p className="mt-2 text-lg">{homepage.availabilityValue}</p>
            </div>
            <Link
              href={homepage.appointmentButtonHref}
              className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-[var(--night)]"
            >
              {homepage.appointmentButtonLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
