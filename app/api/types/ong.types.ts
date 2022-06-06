interface IOngAddress {
  zipCode: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  latitude: string;
  longitude: string;
}

interface IOngAddressUpdate {
  zipCode?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string  | null;
  city?: string | null;
  state?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}

export interface IOng {
  name: string;
  email: string;
  password: string;
  status?: "ACTIVE" | "INACTIVE";
  document: string;
  description: string;
  banner: string;
  phone: string;
  telephone: string;
  website: string;
  facebook: string;
  instagram: string;
  address: IOngAddress;
}

export interface IOngUpdate {
  phone: string;
  telephone: string;
  address: IOngAddressUpdate;
}
