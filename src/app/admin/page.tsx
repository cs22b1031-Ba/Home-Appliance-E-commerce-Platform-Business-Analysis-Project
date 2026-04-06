"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  categoryId: number;
  showPledge?: boolean;
  pledgeTitle?: string | null;
  pledgeText?: string | null;
  material?: string | null;
  dimensions?: string | null;
  warranty?: string | null;
  energyRating?: string | null;
  images: { url: string }[];
  category: { name: string };
};

type HomepageContent = {
  promoText: string;
  searchTitle: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  showroomLabel: string;
  showroomTitle: string;
  tourLabel: string;
  tourTitle: string;
  materialLabLabel: string;
  materialLabText: string;
  collectionsTitle: string;
  collectionsViewAllLabel: string;
  featuredBadge: string;
  featuredTitle: string;
  featuredViewAllLabel: string;
  homepageProductIds: number[];
  appointmentBadge: string;
  appointmentTitle: string;
  appointmentDescription: string;
  availabilityLabel: string;
  availabilityValue: string;
  appointmentButtonLabel: string;
  appointmentButtonHref: string;
  showPledge: boolean;
  pledgeTitle: string;
  pledgeText: string;
};

const emptyCategory = {
  name: "",
  slug: "",
  description: "",
  image: "",
};

const emptyProduct = {
  name: "",
  slug: "",
  description: "",
  priceCents: "",
  categoryId: "",
  material: "",
  dimensions: "",
  warranty: "",
  energyRating: "",
  showPledge: false,
  pledgeTitle: "",
  pledgeText: "",
  mediaUrls: "",
};

const defaultHomepage: HomepageContent = {
  promoText:
    "New season edit now live - Complimentary white-glove delivery above $1,000",
  searchTitle: "Find your perfect piece",
  heroBadge: "Premium curated home",
  heroTitle:
    "Crafted appliances and furniture for luminous, modern interiors.",
  heroDescription:
    "Discover refined statement pieces with white-glove delivery, discreet technology, and materials that age beautifully.",
  primaryCtaLabel: "Shop the collection",
  primaryCtaHref: "/products",
  secondaryCtaLabel: "Living room edit",
  secondaryCtaHref: "/products?category=living-room",
  stat1Value: "48h",
  stat1Label: "Concierge response",
  stat2Value: "5 yr",
  stat2Label: "Extended warranties",
  stat3Value: "120+",
  stat3Label: "Design partners",
  showroomLabel: "Showroom",
  showroomTitle: "New York Atelier",
  tourLabel: "Private tour",
  tourTitle: "Book a session",
  materialLabLabel: "Material Lab",
  materialLabText: "Touches of walnut, limestone, and brushed brass.",
  collectionsTitle: "Curated collections",
  collectionsViewAllLabel: "View all",
  featuredBadge: "Featured pieces",
  featuredTitle: "The Atelier selection",
  featuredViewAllLabel: "Shop all pieces",
  homepageProductIds: [],
  appointmentBadge: "Private appointment",
  appointmentTitle: "Design a complete home narrative with our concierge team.",
  appointmentDescription:
    "Receive bespoke layout guidance, material samples, and tailored appliance packages.",
  availabilityLabel: "Availability",
  availabilityValue: "Next consult: 2 days",
  appointmentButtonLabel: "Schedule appointment",
  appointmentButtonHref: "/products",
  showPledge: false,
  pledgeTitle: "Lunor pledge",
  pledgeText:
    "Every piece is inspected, delivered by white-glove teams, and supported by on-call service for five years.",
};

export default function AdminPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [homepageForm, setHomepageForm] =
    useState<HomepageContent>(defaultHomepage);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-admin-token": token,
    }),
    [token]
  );

  const showError = async (res: Response, fallback: string) => {
    try {
      const payload = await res.json();
      setStatus(payload.message ?? fallback);
    } catch {
      setStatus(fallback);
    }
  };

  const loadData = async () => {
    if (!token) return;
    setStatus("Loading...");

    const [categoriesRes, productsRes, homepageRes] = await Promise.all([
      fetch("/api/admin/categories", { headers }),
      fetch("/api/admin/products", { headers }),
      fetch("/api/admin/homepage", { headers }),
    ]);

    if (!categoriesRes.ok || !productsRes.ok || !homepageRes.ok) {
      await showError(categoriesRes, "Token invalid or API failed.");
      return;
    }

    const categoriesData = await categoriesRes.json();
    const productsData = await productsRes.json();
    const homepageData = await homepageRes.json();

    setCategories(categoriesData);
    setProducts(productsData);
    setHomepageForm(homepageData);

    if (!productForm.categoryId && categoriesData.length > 0) {
      setProductForm((prev) => ({
        ...prev,
        categoryId: String(categoriesData[0].id),
      }));
    }

    setStatus("");
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const saveHomepage = async () => {
    setStatus("Saving homepage content...");

    const res = await fetch("/api/admin/homepage", {
      method: "PATCH",
      headers,
      body: JSON.stringify(homepageForm),
    });

    if (!res.ok) {
      await showError(res, "Failed to save homepage content.");
      return;
    }

    setStatus("Homepage content saved.");
  };

  const createCategory = async () => {
    if (!categoryForm.name || !categoryForm.slug) {
      setStatus("Category name and slug are required.");
      return;
    }

    setStatus("Adding category...");
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers,
      body: JSON.stringify(categoryForm),
    });

    if (!res.ok) {
      await showError(res, "Failed to add category.");
      return;
    }

    setCategoryForm(emptyCategory);
    await loadData();
    setStatus("Category added.");
  };

  const deleteCategory = async (id: number) => {
    setStatus("Deleting category...");
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      await showError(res, "Failed to delete category.");
      return;
    }

    await loadData();
    setStatus("Category deleted.");
  };

  const createProduct = async () => {
    if (
      !productForm.name ||
      !productForm.slug ||
      !productForm.description ||
      !productForm.priceCents ||
      !productForm.categoryId
    ) {
      setStatus("Name, slug, description, price, and category are required.");
      return;
    }

    setStatus("Adding product...");
    const media = productForm.mediaUrls
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...productForm,
        priceCents: Number(productForm.priceCents),
        categoryId: Number(productForm.categoryId),
        material: productForm.material || null,
        dimensions: productForm.dimensions || null,
        warranty: productForm.warranty || null,
        energyRating: productForm.energyRating || null,
        showPledge: productForm.showPledge,
        pledgeTitle: productForm.pledgeTitle || null,
        pledgeText: productForm.pledgeText || null,
        images: media,
      }),
    });

    if (!res.ok) {
      await showError(res, "Failed to add product.");
      return;
    }

    setProductForm((prev) => ({
      ...emptyProduct,
      categoryId: prev.categoryId,
    }));
    await loadData();
    setStatus("Product added.");
  };

  const loadProductForEdit = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      priceCents: String(product.priceCents),
      categoryId: String(product.categoryId),
      material: product.material || "",
      dimensions: product.dimensions || "",
      warranty: product.warranty || "",
      energyRating: product.energyRating || "",
      showPledge: Boolean(product.showPledge),
      pledgeTitle: product.pledgeTitle || "",
      pledgeText: product.pledgeText || "",
      mediaUrls: product.images.map((image) => image.url).join("\n"),
    });
    setStatus(`Editing ${product.name}`);
  };

  const updateProduct = async () => {
    if (!editingProductId) {
      setStatus("Select a product to edit first.");
      return;
    }
    if (
      !productForm.name ||
      !productForm.slug ||
      !productForm.description ||
      !productForm.priceCents ||
      !productForm.categoryId
    ) {
      setStatus("Name, slug, description, price, and category are required.");
      return;
    }

    setStatus("Updating product...");
    const media = productForm.mediaUrls
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const res = await fetch(`/api/admin/products/${editingProductId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        ...productForm,
        priceCents: Number(productForm.priceCents),
        categoryId: Number(productForm.categoryId),
        material: productForm.material || null,
        dimensions: productForm.dimensions || null,
        warranty: productForm.warranty || null,
        energyRating: productForm.energyRating || null,
        showPledge: productForm.showPledge,
        pledgeTitle: productForm.pledgeTitle || null,
        pledgeText: productForm.pledgeText || null,
        images: media,
      }),
    });

    if (!res.ok) {
      await showError(res, "Failed to update product.");
      return;
    }

    await loadData();
    setEditingProductId(null);
    setProductForm((prev) => ({
      ...emptyProduct,
      categoryId: prev.categoryId,
    }));
    setStatus("Product updated.");
  };

  const deleteProduct = async (id: number) => {
    setStatus("Deleting product...");
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      await showError(res, "Failed to delete product.");
      return;
    }

    await loadData();
    setStatus("Product deleted.");
  };


  const uploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setStatus("Uploading images...");

    const uploadedUrls: string[] = [];
    for (const file of Array.from(files)) {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "x-admin-token": token,
        },
        body: data,
      });

      if (res.ok) {
        const payload = await res.json();
        if (payload.url) uploadedUrls.push(payload.url);
      }
    }

    setProductForm((prev) => ({
      ...prev,
      mediaUrls: prev.mediaUrls
        ? `${prev.mediaUrls}\n${uploadedUrls.join("\n")}`
        : uploadedUrls.join("\n"),
    }));

    setUploading(false);
    setStatus(uploadedUrls.length ? "Images uploaded." : "Upload failed.");
  };

  if (!token) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Admin access</h1>
        <p className="mt-4 text-sm text-[var(--umber)]">
          Open this page as:
          <code className="ml-2 rounded bg-white/70 px-2 py-1">
            /admin?token=YOUR_ADMIN_TOKEN
          </code>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Admin dashboard</h1>
          <p className="mt-2 text-sm text-[var(--umber)]">
            Manage homepage content, products, and categories.
          </p>
        </div>
        <Link
          href={`/admin/overview?token=${token}`}
          className="rounded-full border border-[rgba(90,70,52,0.3)] px-5 py-2 text-sm font-semibold text-[var(--umber)]"
        >
          View overview
        </Link>
      </div>

      <section className="mt-8 rounded-3xl border border-white/60 bg-white/70 p-6">
        <h2 className="text-lg font-semibold">Homepage content</h2>
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <input
            value={homepageForm.promoText}
            onChange={(e) =>
              setHomepageForm((prev) => ({ ...prev, promoText: e.target.value }))
            }
            placeholder="Promo text"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3 md:col-span-2"
          />
          <input
            value={homepageForm.searchTitle}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                searchTitle: e.target.value,
              }))
            }
            placeholder="Search title"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3 md:col-span-2"
          />
          <input
            value={homepageForm.heroBadge}
            onChange={(e) =>
              setHomepageForm((prev) => ({ ...prev, heroBadge: e.target.value }))
            }
            placeholder="Hero badge"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3 md:col-span-2"
          />
          <input
            value={homepageForm.heroTitle}
            onChange={(e) =>
              setHomepageForm((prev) => ({ ...prev, heroTitle: e.target.value }))
            }
            placeholder="Hero title"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3 md:col-span-2"
          />
          <textarea
            value={homepageForm.heroDescription}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                heroDescription: e.target.value,
              }))
            }
            rows={3}
            placeholder="Hero description"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3 md:col-span-2"
          />
          <input
            value={homepageForm.primaryCtaLabel}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                primaryCtaLabel: e.target.value,
              }))
            }
            placeholder="Primary CTA label"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.primaryCtaHref}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                primaryCtaHref: e.target.value,
              }))
            }
            placeholder="Primary CTA href"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.secondaryCtaLabel}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                secondaryCtaLabel: e.target.value,
              }))
            }
            placeholder="Secondary CTA label"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.secondaryCtaHref}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                secondaryCtaHref: e.target.value,
              }))
            }
            placeholder="Secondary CTA href"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.stat1Value}
            onChange={(e) =>
              setHomepageForm((prev) => ({ ...prev, stat1Value: e.target.value }))
            }
            placeholder="Stat 1 value"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.stat1Label}
            onChange={(e) =>
              setHomepageForm((prev) => ({ ...prev, stat1Label: e.target.value }))
            }
            placeholder="Stat 1 label"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.stat2Value}
            onChange={(e) =>
              setHomepageForm((prev) => ({ ...prev, stat2Value: e.target.value }))
            }
            placeholder="Stat 2 value"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.stat2Label}
            onChange={(e) =>
              setHomepageForm((prev) => ({ ...prev, stat2Label: e.target.value }))
            }
            placeholder="Stat 2 label"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.stat3Value}
            onChange={(e) =>
              setHomepageForm((prev) => ({ ...prev, stat3Value: e.target.value }))
            }
            placeholder="Stat 3 value"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.stat3Label}
            onChange={(e) =>
              setHomepageForm((prev) => ({ ...prev, stat3Label: e.target.value }))
            }
            placeholder="Stat 3 label"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.showroomLabel}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                showroomLabel: e.target.value,
              }))
            }
            placeholder="Showroom label"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.showroomTitle}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                showroomTitle: e.target.value,
              }))
            }
            placeholder="Showroom title"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.tourLabel}
            onChange={(e) =>
              setHomepageForm((prev) => ({ ...prev, tourLabel: e.target.value }))
            }
            placeholder="Tour label"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.tourTitle}
            onChange={(e) =>
              setHomepageForm((prev) => ({ ...prev, tourTitle: e.target.value }))
            }
            placeholder="Tour title"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.materialLabLabel}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                materialLabLabel: e.target.value,
              }))
            }
            placeholder="Material lab label"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.materialLabText}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                materialLabText: e.target.value,
              }))
            }
            placeholder="Material lab text"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.collectionsTitle}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                collectionsTitle: e.target.value,
              }))
            }
            placeholder="Collections title"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.collectionsViewAllLabel}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                collectionsViewAllLabel: e.target.value,
              }))
            }
            placeholder="Collections view-all label"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.featuredBadge}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                featuredBadge: e.target.value,
              }))
            }
            placeholder="Featured badge"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.featuredTitle}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                featuredTitle: e.target.value,
              }))
            }
            placeholder="Featured title"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.featuredViewAllLabel}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                featuredViewAllLabel: e.target.value,
              }))
            }
            placeholder="Featured view-all label"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.homepageProductIds.join(",")}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                homepageProductIds: e.target.value
                  .split(",")
                  .map((value) => Number(value.trim()))
                  .filter((value) => Number.isFinite(value) && value > 0),
              }))
            }
            placeholder="Homepage product IDs (comma separated)"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3 md:col-span-2"
          />
          <input
            value={homepageForm.appointmentBadge}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                appointmentBadge: e.target.value,
              }))
            }
            placeholder="Appointment badge"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.appointmentTitle}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                appointmentTitle: e.target.value,
              }))
            }
            placeholder="Appointment title"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3 md:col-span-2"
          />
          <textarea
            value={homepageForm.appointmentDescription}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                appointmentDescription: e.target.value,
              }))
            }
            rows={3}
            placeholder="Appointment description"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3 md:col-span-2"
          />
          <input
            value={homepageForm.availabilityLabel}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                availabilityLabel: e.target.value,
              }))
            }
            placeholder="Availability label"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.availabilityValue}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                availabilityValue: e.target.value,
              }))
            }
            placeholder="Availability value"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.appointmentButtonLabel}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                appointmentButtonLabel: e.target.value,
              }))
            }
            placeholder="Appointment button label"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <input
            value={homepageForm.appointmentButtonHref}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                appointmentButtonHref: e.target.value,
              }))
            }
            placeholder="Appointment button href"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
          />
          <label className="flex items-center gap-2 rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3 text-sm md:col-span-2">
            <input
              type="checkbox"
              checked={homepageForm.showPledge}
              onChange={(e) =>
                setHomepageForm((prev) => ({
                  ...prev,
                  showPledge: e.target.checked,
                }))
              }
            />
            Show pledge on product page
          </label>
          <input
            value={homepageForm.pledgeTitle}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                pledgeTitle: e.target.value,
              }))
            }
            placeholder="Pledge title"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3 md:col-span-2"
          />
          <textarea
            value={homepageForm.pledgeText}
            onChange={(e) =>
              setHomepageForm((prev) => ({
                ...prev,
                pledgeText: e.target.value,
              }))
            }
            rows={3}
            placeholder="Pledge text"
            className="rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3 md:col-span-2"
          />
        </div>
        <button
          type="button"
          onClick={saveHomepage}
          className="mt-4 rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white"
        >
          Save homepage
        </button>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-white/60 bg-white/70 p-6">
          <h2 className="text-lg font-semibold">Add category</h2>
          <div className="mt-4 space-y-3 text-sm">
            <input
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Name"
              className="w-full rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
            <input
              value={categoryForm.slug}
              onChange={(e) =>
                setCategoryForm((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="Slug (unique)"
              className="w-full rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
            <input
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Description"
              className="w-full rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
            <input
              value={categoryForm.image}
              onChange={(e) =>
                setCategoryForm((prev) => ({ ...prev, image: e.target.value }))
              }
              placeholder="Image URL"
              className="w-full rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
            <button
              type="button"
              onClick={createCategory}
              className="rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white"
            >
              Add category
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-white/60 bg-white/70 p-6">
          <h2 className="text-lg font-semibold">
            {editingProductId ? "Edit product" : "Add product"}
          </h2>
          <div className="mt-4 space-y-3 text-sm">
            <select
              value={productForm.categoryId}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  categoryId: e.target.value,
                }))
              }
              className="w-full rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              value={productForm.name}
              onChange={(e) =>
                setProductForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Name"
              className="w-full rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
            <input
              value={productForm.slug}
              onChange={(e) =>
                setProductForm((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="Slug (unique)"
              className="w-full rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
            <textarea
              value={productForm.description}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Description"
              rows={3}
              className="w-full rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
            <input
              value={productForm.priceCents}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  priceCents: e.target.value,
                }))
              }
              placeholder="Price in paise (e.g. 249900 = INR 2,499)"
              className="w-full rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
            <input
              value={productForm.material}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  material: e.target.value,
                }))
              }
              placeholder="Material (optional)"
              className="w-full rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
            <input
              value={productForm.dimensions}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  dimensions: e.target.value,
                }))
              }
              placeholder="Dimensions (optional)"
              className="w-full rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
            <input
              value={productForm.warranty}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  warranty: e.target.value,
                }))
              }
              placeholder="Warranty (optional)"
              className="w-full rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
            <input
              value={productForm.energyRating}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  energyRating: e.target.value,
                }))
              }
              placeholder="Energy rating (optional)"
              className="w-full rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
            <label className="flex items-center gap-2 rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3 text-sm">
              <input
                type="checkbox"
                checked={productForm.showPledge}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    showPledge: e.target.checked,
                  }))
                }
              />
              Show pledge for this product
            </label>
            <input
              value={productForm.pledgeTitle}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  pledgeTitle: e.target.value,
                }))
              }
              placeholder="Product pledge title"
              className="w-full rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
            <textarea
              value={productForm.pledgeText}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  pledgeText: e.target.value,
                }))
              }
              placeholder="Product pledge text"
              rows={3}
              className="w-full rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
            <textarea
              value={productForm.mediaUrls}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  mediaUrls: e.target.value,
                }))
              }
              placeholder="Media URLs (images/videos, one per line)"
              rows={3}
              className="w-full rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              disabled={uploading}
              onChange={(e) => uploadImages(e.target.files)}
              className="w-full rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
            />
            <button
              type="button"
              onClick={createProduct}
              className="rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-white"
            >
              Add product
            </button>
            {editingProductId ? (
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={updateProduct}
                  className="rounded-full border border-[var(--ink)] px-6 py-3 text-sm font-semibold text-[var(--ink)]"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProductId(null);
                    setProductForm((prev) => ({
                      ...emptyProduct,
                      categoryId: prev.categoryId,
                    }));
                    setStatus("Edit cancelled.");
                  }}
                  className="rounded-full border border-[rgba(90,70,52,0.3)] px-6 py-3 text-sm font-semibold text-[var(--umber)]"
                >
                  Cancel edit
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-white/60 bg-white/70 p-6">
          <h2 className="text-lg font-semibold">Delete category</h2>
          <div className="mt-4 space-y-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold">{category.name}</p>
                  <p className="text-xs text-[var(--umber)]">{category.slug}</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteCategory(category.id)}
                  className="rounded-full border border-red-300 px-4 py-2 text-xs text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/60 bg-white/70 p-6">
          <h2 className="text-lg font-semibold">Delete product</h2>
          <div className="mt-4 space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-2xl border border-[rgba(90,70,52,0.2)] bg-white/90 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold">{product.name}</p>
                  <p className="text-xs text-[var(--umber)]">
                    {product.slug} - {product.category?.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => loadProductForEdit(product)}
                    className="rounded-full border border-[rgba(90,70,52,0.3)] px-4 py-2 text-xs text-[var(--umber)]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProduct(product.id)}
                    className="rounded-full border border-red-300 px-4 py-2 text-xs text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {status ? (
        <p className="mt-6 text-sm text-[var(--umber)]">{status}</p>
      ) : null}
    </main>
  );
}
