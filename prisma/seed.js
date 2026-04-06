require("dotenv/config");
const path = require("node:path");

if (process.env.DATABASE_URL?.startsWith("file:./")) {
  const relative = process.env.DATABASE_URL.replace("file:./", "");
  process.env.DATABASE_URL = `file:${path.join(process.cwd(), relative)}`;
}
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categories = [
  {
    name: "Living Room",
    slug: "living-room",
    description: "Sculpted comfort for spaces that host and unwind.",
    image:
      "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Bedroom",
    slug: "bedroom",
    description: "Quiet luxury, layered textiles, restorative design.",
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Kitchen",
    slug: "kitchen",
    description: "Precision appliances with tactile, modern finishes.",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Home Office",
    slug: "home-office",
    description: "Executive ergonomics that elevate focus.",
    image:
      "https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1600&q=80",
  },
];

const products = [
  {
    name: "Aurora Cloud Sectional",
    slug: "aurora-cloud-sectional",
    description:
      "A low-slung, modular sectional wrapped in performance boucle. Deep seats and feather-soft support invite an all-day linger.",
    priceCents: 489000,
    compareAtCents: 529000,
    rating: 4.9,
    reviewCount: 214,
    stock: 12,
    featured: true,
    material: "Performance boucle, FSC kiln-dried oak",
    dimensions: "118 in W x 42 in D x 27 in H",
    warranty: "5-year frame warranty",
    categorySlug: "living-room",
    images: [
      {
        url: "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1600&q=80",
        alt: "Cream modular sectional in a modern living room",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=80",
        alt: "Detail of textured boucle upholstery",
      },
    ],
  },
  {
    name: "Helios Marble Media Console",
    slug: "helios-marble-media-console",
    description:
      "Monolithic oak and Calacatta-inspired stone with soft-close drawers and hidden cable channels.",
    priceCents: 239000,
    compareAtCents: 269000,
    rating: 4.8,
    reviewCount: 136,
    stock: 20,
    featured: true,
    material: "White oak veneer, engineered marble",
    dimensions: "84 in W x 18 in D x 22 in H",
    warranty: "3-year finish warranty",
    categorySlug: "living-room",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
        alt: "Marble and oak media console",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
        alt: "Close up of marble surface",
      },
    ],
  },
  {
    name: "Luma Heritage Bed",
    slug: "luma-heritage-bed",
    description:
      "An elevated platform bed with a floating headboard and soft saddle leather inlay.",
    priceCents: 329000,
    compareAtCents: 359000,
    rating: 4.9,
    reviewCount: 178,
    stock: 14,
    featured: true,
    material: "Solid walnut, saddle leather",
    dimensions: "86 in W x 94 in D x 44 in H",
    warranty: "5-year structural warranty",
    categorySlug: "bedroom",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80",
        alt: "Walnut bed with leather headboard",
        isPrimary: true,
      },
      {
        url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
        alt: "Bedside detail in warm light",
      },
    ],
  },
  {
    name: "Serein Linen Duvet Set",
    slug: "serein-linen-duvet-set",
    description:
      "Stonewashed European linen for a softly rumpled, breathable sleep environment.",
    priceCents: 48000,
    compareAtCents: 55000,
    rating: 4.7,
    reviewCount: 321,
    stock: 60,
    featured: false,
    material: "100% European flax linen",
    dimensions: "King",
    warranty: "2-year textile warranty",
    categorySlug: "bedroom",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505693314127-66a8b5c7f0c1?auto=format&fit=crop&w=1600&q=80",
        alt: "Linen duvet set in soft beige",
        isPrimary: true,
      },
    ],
  },
  {
    name: "Arcadia Induction Range",
    slug: "arcadia-induction-range",
    description:
      "Rapid, precise induction with a seamless glass surface and hidden touch controls.",
    priceCents: 199000,
    compareAtCents: 219000,
    rating: 4.8,
    reviewCount: 96,
    stock: 18,
    featured: true,
    material: "Tempered ceramic glass",
    dimensions: "30 in W x 27 in D x 36 in H",
    warranty: "4-year appliance warranty",
    energyRating: "ENERGY STAR",
    categorySlug: "kitchen",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1600&q=80",
        alt: "Modern induction range in a minimalist kitchen",
        isPrimary: true,
      },
    ],
  },
  {
    name: "Nimbus Smart Refrigerator",
    slug: "nimbus-smart-refrigerator",
    description:
      "Quiet cooling, adaptive humidity zones, and a refined matte finish.",
    priceCents: 259000,
    compareAtCents: 289000,
    rating: 4.7,
    reviewCount: 112,
    stock: 10,
    featured: false,
    material: "Matte steel",
    dimensions: "36 in W x 30 in D x 70 in H",
    warranty: "5-year sealed system warranty",
    energyRating: "ENERGY STAR",
    categorySlug: "kitchen",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80",
        alt: "Premium refrigerator in modern kitchen",
        isPrimary: true,
      },
    ],
  },
  {
    name: "Vanta Executive Desk",
    slug: "vanta-executive-desk",
    description:
      "A charcoal oak workspace with integrated cable management and velvet-lined storage.",
    priceCents: 149000,
    compareAtCents: 169000,
    rating: 4.8,
    reviewCount: 143,
    stock: 22,
    featured: false,
    material: "Ebonized oak, brushed brass",
    dimensions: "70 in W x 30 in D x 30 in H",
    warranty: "3-year warranty",
    categorySlug: "home-office",
    images: [
      {
        url: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1600&q=80",
        alt: "Executive desk with brass accents",
        isPrimary: true,
      },
    ],
  },
  {
    name: "Aether Ergonomic Chair",
    slug: "aether-ergonomic-chair",
    description:
      "Sculpted lumbar support, breathable mesh, and polished aluminum frame.",
    priceCents: 89000,
    compareAtCents: 99000,
    rating: 4.8,
    reviewCount: 287,
    stock: 40,
    featured: false,
    material: "3D knit mesh, aluminum frame",
    dimensions: "28 in W x 26 in D x 45 in H",
    warranty: "7-year mechanism warranty",
    categorySlug: "home-office",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
        alt: "Ergonomic chair with mesh back",
        isPrimary: true,
      },
    ],
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const product of products) {
    const category = await prisma.category.findUnique({
      where: { slug: product.categorySlug },
    });

    if (!category) continue;

    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        compareAtCents: product.compareAtCents,
        rating: product.rating,
        reviewCount: product.reviewCount,
        stock: product.stock,
        featured: product.featured,
        material: product.material,
        dimensions: product.dimensions,
        warranty: product.warranty,
        energyRating: product.energyRating,
        categoryId: category.id,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        priceCents: product.priceCents,
        compareAtCents: product.compareAtCents,
        rating: product.rating,
        reviewCount: product.reviewCount,
        stock: product.stock,
        featured: product.featured,
        material: product.material,
        dimensions: product.dimensions,
        warranty: product.warranty,
        energyRating: product.energyRating,
        categoryId: category.id,
      },
    });

    await prisma.productImage.deleteMany({
      where: { productId: created.id },
    });

    await prisma.productImage.createMany({
      data: product.images.map((image) => ({
        productId: created.id,
        url: image.url,
        alt: image.alt,
        isPrimary: Boolean(image.isPrimary),
      })),
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
