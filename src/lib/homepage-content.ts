import fs from "node:fs/promises";
import path from "node:path";

export type HomepageContent = {
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

const defaultContent: HomepageContent = {
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

const contentFilePath = path.join(
  process.cwd(),
  "src",
  "data",
  "homepage-content.json"
);

export async function readHomepageContent(): Promise<HomepageContent> {
  try {
    const raw = await fs.readFile(contentFilePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<HomepageContent>;
    return {
      ...defaultContent,
      ...parsed,
    };
  } catch {
    return defaultContent;
  }
}

export async function writeHomepageContent(input: Partial<HomepageContent>) {
  const current = await readHomepageContent();
  const next = {
    ...current,
    ...input,
  };

  await fs.writeFile(contentFilePath, JSON.stringify(next, null, 2));
  return next;
}
