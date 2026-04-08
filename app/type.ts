export interface Category {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  bannerImage: string;
  bannerBg: string;
  accentColor: string;
  icon: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  images: string[];
  price: number;
  salePrice: number | null;
  discount: number | null;
  inStock: boolean;
  features: string[];
  categories: string[];
  returnPolicy: string;
}