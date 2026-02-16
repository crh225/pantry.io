export interface KrogerProduct {
  productId: string;
  upc: string;
  description: string;
  brand: string;
  price: { regular: number; promo?: number } | null;
  image: string;
  aisle: string;
  size: string;
}

export interface KrogerStore {
  locationId: string;
  name: string;
  address: string;
  distance: number;
}

export interface KrogerConfig {
  clientId: string;
  clientSecret: string;
  locationId?: string;
}
