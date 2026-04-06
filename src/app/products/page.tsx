import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product-card";
import { getPrimaryImageUrl } from "@/lib/media";
import type { Prisma } from "@prisma/client";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; query?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const categorySlug = resolvedSearchParams?.category;
  const rawQuery = resolvedSearchParams?.query ?? "";
  const query = rawQuery.trim();

  const filters: Prisma.ProductWhereInput[] = [];
  if (categorySlug) {
    filters.push({
      category: {
        slug: categorySlug,
      },
    });
  }

  if (query) {
    filters.push({
      OR: [
        { name: { contains: query } },
        { slug: { contains: query } },
        { description: { contains: query } },
        {
          category: {
            OR: [
              { name: { contains: query } },
              { slug: { contains: query } },
              { description: { contains: query } },
            ],
          },
        },
      ],
    });
  }

  const where = filters.length > 0 ? { AND: filters } : undefined;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where,
      include: { images: true, category: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const activeCategory = categories.find((category) => category.slug === categorySlug);
  const buildCategoryLink = (slug?: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (query) params.set("query", query);
    const value = params.toString();
    return value ? `/products?${value}` : "/products";
  };

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--umber)]">
            Collections
          </p>
          <h1 className="mt-4 text-4xl font-semibold">
            {activeCategory ? activeCategory.name : "All pieces"}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--umber)]">
            {activeCategory?.description ??
              "An edit of furniture and appliances chosen for material integrity, tactile detail, and timeless silhouettes."}
          </p>
        </div>
        <Link
          href={buildCategoryLink()}
          className="text-sm font-semibold text-[var(--umber)]"
        >
          Reset filters
        </Link>
      </div>

      <form
        action="/products"
        method="get"
        className="mt-8 rounded-3xl border border-white/60 bg-white/70 p-4"
      >
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            type="text"
            name="query"
            defaultValue={query}
            placeholder="Search products and categories..."
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white px-4 py-3 text-sm"
          />
          {categorySlug ? (
            <input type="hidden" name="category" value={categorySlug} />
          ) : null}
          <button
            type="submit"
            className="rounded-2xl bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white"
          >
            Search
          </button>
        </div>
      </form>

      {query ? (
        <p className="mt-4 text-sm text-[var(--umber)]">
          Showing {products.length} result(s) for &quot;{query}&quot;.
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={buildCategoryLink(category.slug)}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
              category.slug === categorySlug
                ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                : "border-[rgba(90,70,52,0.2)] text-[var(--umber)] hover:border-[var(--umber)]"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
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
      {products.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-white/60 bg-white/80 p-8 text-center text-sm text-[var(--umber)]">
          No matching products found. Try a different keyword or clear filters.
        </div>
      ) : null}
    </main>
  );
}
