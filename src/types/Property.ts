export interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number; // Price in HBAR
  amenities: string[];
  imageUrl: string;
  hostEmail?: string;
  hostWallet?: string;
  contactDetails?: {
    phone?: string;
    email?: string;
    address?: string;
  };
}

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  amenities?: string[];
  searchTerm?: string;
}
