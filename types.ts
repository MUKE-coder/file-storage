export type TargetGroup =
  | "Men"
  | "Women"
  | "Children"
  | "Home"
  | "Office"
  | "Others"
  | "Boyfriend"
  | "Girlfriend"
  | "Wedding"
  | "Corporate";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  subCategory: TargetGroup;
  description: string;
  longDescription?: string;
  specifications?: Record<string, string>;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBundle?: boolean;
  bundleItems?: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customer: string;
  total: number;
  status: "completed" | "pending" | "cancelled";
  date: string;
}
