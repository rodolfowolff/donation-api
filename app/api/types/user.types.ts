interface IUserAddress {
  zipCode: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
}

interface IUserAddressUpdate {
  zipCode?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  status?: "ACTIVE" | "INACTIVE";
  document: string;
  birthDate: string;
  telephone: string;
  address: IUserAddress;
}

export interface IUserUpdate {
  email?: string | null;
  telephone?: string | null;
  address?: IUserAddressUpdate | null;
}
