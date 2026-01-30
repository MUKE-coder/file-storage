import { Product, Category, TargetGroup } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "gifts",
    name: "Curated Bundles",
    description: "Thoughtfully paired items for life’s big moments.",
    image:
      "https://images.unsplash.com/photo-1549465220-1d8c9d9c67ad?q=80&w=1200",
  },
  {
    id: "grooming",
    name: "Men’s Grooming",
    description: "Modern aftershaves and luxury skincare.",
    image:
      "https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?q=80&w=1200",
  },
  {
    id: "tech",
    name: "Tech & Gadgets",
    description: "RFID protection and smart accessories.",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1200",
  },
  {
    id: "women-beauty",
    name: "Women’s Beauty",
    description: "Elite serums and organic fragrances.",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=1200",
  },
  {
    id: "fashion",
    name: "Modern Accessories",
    description: "Crafted timepieces and artisan leather.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200",
  },
  {
    id: "home",
    name: "Home & Living",
    description: "Ambient lighting and minimalist decor.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed657f9970?q=80&w=1200",
  },
  {
    id: "office",
    name: "Office Essentials",
    description: "Premium productivity tools.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200",
  },
  {
    id: "wellness",
    name: "Wellness & Spa",
    description: "Inner calm for the busy professional.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200",
  },
  {
    id: "kids",
    name: "Kids & Learning",
    description: "Educational tech and premium toys.",
    image:
      "https://images.unsplash.com/photo-1533561052604-c3eba0155530?q=80&w=1200",
  },
  {
    id: "auto",
    name: "Automotive Luxe",
    description: "Advanced gear for your drive.",
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200",
  },
];

const BUNDLE_TEMPLATES = [
  {
    sub: "Boyfriend",
    name: "The Modern Gentleman Pack",
    items: ["RFID Carbon Wallet", "Oud Noir Perfume", "Titanium Card Holder"],
  },
  {
    sub: "Girlfriend",
    name: "The Serenity Glow Set",
    items: ["Hyaluronic Serum", "Silk Sleep Mask", "Amethyst Scented Candle"],
  },
  {
    sub: "Wedding",
    name: "The Groom’s Morning Pack",
    items: [
      "Luxury Shave Kit",
      "Monogrammed Cufflinks",
      "Artisan Coffee beans",
    ],
  },
  {
    sub: "Wedding",
    name: "The Bridal Radiance Kit",
    items: ["Gold Flake Serum", "Lace Robe", "Premium Bath Salts"],
  },
  {
    sub: "Corporate",
    name: "The Executive Power Box",
    items: ["Leather Desk Pad", "Fountain Pen", "MagSafe Charging Hub"],
  },
];

const PRODUCT_BASES = [
  {
    cat: "grooming",
    name: "Ocean Mist Aftershave",
    sub: "Men",
    img: "https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d",
  },
  {
    cat: "tech",
    name: "Stealth RFID Wallet",
    sub: "Men",
    img: "https://images.unsplash.com/photo-1627123424574-724758594e93",
  },
  {
    cat: "tech",
    name: "HyperCharge Pro Powerbank",
    sub: "Others",
    img: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5",
  },
  {
    cat: "fashion",
    name: "Classic Chronograph",
    sub: "Men",
    img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
  },
  {
    cat: "women-beauty",
    name: "Vit-C Luminous Oil",
    sub: "Women",
    img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19",
  },
  {
    cat: "home",
    name: "Minimalist Arc Lamp",
    sub: "Home",
    img: "https://images.unsplash.com/photo-1534073828943-f801091bb18c",
  },
  {
    cat: "office",
    name: "Mechanical Low-Profile Keyboard",
    sub: "Office",
    img: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae",
  },
  {
    cat: "wellness",
    name: "Deep Tissue Massage Gun",
    sub: "Others",
    img: "https://images.unsplash.com/photo-1591343395082-e120087004b4",
  },
  {
    cat: "kids",
    name: "Quantum Physics for Toddlers",
    sub: "Children",
    img: "https://images.unsplash.com/photo-1516627145497-ae6968895b74",
  },
  {
    cat: "auto",
    name: "4K Mirror Dash Cam",
    sub: "Others",
    img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
  },
];

const generateProducts = (): Product[] => {
  const products: Product[] = [];

  // 1. Generate 40 Bundle Packs
  for (let i = 1; i <= 40; i++) {
    const template = BUNDLE_TEMPLATES[i % BUNDLE_TEMPLATES.length];
    products.push({
      id: `bundle-${i}`,
      name: `${template.name} Edition ${i}`,
      price: 120 + i * 5,
      category: "gifts",
      subCategory: template.sub as TargetGroup,
      description: `The ultimate gift for your ${template.sub.toLowerCase()}. Curated for excellence.`,
      longDescription: `Specially assembled for the discerning giver, this ${template.name} features ${template.items.join(", ")}. Each component is vetted for its premium quality and contribution to a luxurious lifestyle.`,
      specifications: {
        Collection: "Zuri Curated 2024",
        Packaging: "Eco-Luxe Gift Wrapping",
        "Gift Card": "Handwritten Option Available",
        Delivery: "Same-day Kampala Express",
      },
      image: `https://images.unsplash.com/photo-1549465220-1d8c9d9c67ad?q=80&w=800&sig=bundle-${i}`,
      images: [
        `https://images.unsplash.com/photo-1549465220-1d8c9d9c67ad?q=80&w=800&sig=b-${i}-1`,
        `https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&sig=b-${i}-2`,
        `https://images.unsplash.com/photo-1512909006721-3d6018887183?q=80&w=800&sig=b-${i}-3`,
      ],
      rating: 4.8,
      reviews: 24,
      stock: 12,
      isBundle: true,
      bundleItems: template.items,
      isFeatured: i < 8,
      isTrending: i % 4 === 0,
    });
  }

  // 2. Generate 180 Individual Products (Total 220)
  for (let i = 1; i <= 180; i++) {
    const base = PRODUCT_BASES[i % PRODUCT_BASES.length];
    const uniqueSuffix = String.fromCharCode(65 + (i % 26)) + (i % 10);
    products.push({
      id: `prod-${i}`,
      name: `${base.name} Select ${uniqueSuffix}`,
      price: 25 + (i % 30) * 8,
      category: base.cat,
      subCategory: base.sub as TargetGroup,
      description: `International grade ${base.name.toLowerCase()} inspired by top Amazon and eBay collections.`,
      longDescription: `Sourced from top global manufacturers, this ${base.name} brings world-class quality to your doorstep. Every detail from the ergonomics to the durability has been tested against extreme conditions.`,
      specifications: {
        Grade: "Premium A+",
        Warranty: "24 Months International",
        Source: i % 2 === 0 ? "Amazon USA" : "eBay UK",
        Weight: "Lightweight / Durable",
      },
      image: `${base.img}?q=80&w=800&sig=prod-${i}`,
      images: [
        `${base.img}?q=80&w=800&sig=prod-${i}-1`,
        `${base.img}-2?q=80&w=800&sig=prod-${i}-2`,
        `${base.img}-3?q=80&w=800&sig=prod-${i}-3`,
      ],
      rating: 4.5,
      reviews: 140,
      stock: 50,
      isNew: i % 10 === 0,
      isFeatured: i % 20 === 0,
      isTrending: i % 6 === 0,
    });
  }

  return products;
};

export const PRODUCTS = generateProducts();
