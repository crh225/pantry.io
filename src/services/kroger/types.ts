export interface KrogerProduct {
  productId: string; upc: string; description: string; brand: string;
  price: { regular: number; promo?: number } | null;
  image: string; aisle: string; size: string;
}

export interface KrogerStore {
  locationId: string; name: string; address: string; city: string;
  state: string; zipCode: string; phone: string; distance: number;
  chain: string; departments: KrogerDepartment[];
  hours: KrogerStoreHours | null;
  geolocation: { latitude: number; longitude: number } | null;
}

export interface KrogerDepartment {
  departmentId: string; name: string;
  phone?: string; hours?: KrogerStoreHours;
}

export interface KrogerStoreHours {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
  open24Hours?: boolean;
}

export interface KrogerProfile {
  id: string; firstName: string; lastName: string;
}

export interface KrogerConfig {
  clientId: string; clientSecret: string; locationId?: string;
}
