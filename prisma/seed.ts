import db from "@/lib/prisma";
import { Prisma } from "../app/generated/prisma/client";

const categoriesData: Prisma.CategoryCreateInput[] = [
  {
    name: "Curated Bundles",
    slug: "curated-bundles",
    description: "Thoughtfully paired items for life’s big moments.",
    image:
      "https://images.unsplash.com/photo-1549465220-1d8c9d9c67ad?q=80&w=1200",
    isFeatured: true,
  },
  {
    name: "Men’s Grooming",
    slug: "mens-grooming",
    description: "Modern aftershaves and luxury skincare.",
    image:
      "https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?q=80&w=1200",
  },
  {
    name: "Tech & Gadgets",
    slug: "tech-and-gadgets",
    description: "RFID protection and smart accessories.",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1200",
    isFeatured: true,
  },
];

export async function main() {
  for (const cat of categoriesData) {
    await db.category.create({ data: cat });
  }
}

main();
