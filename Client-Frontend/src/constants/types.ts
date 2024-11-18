export interface userData {
  id: string;
  name?: string;
  email?: string;
  role?: Role;
  createdAt?: string;
  password?: string;
  targetAmount?: number;
  currentTarget?: number;
}

export interface userState {
  // avatar?: string;
  name: string;
  email: string;
  role: Role;
  password: string;
  targetAmount: number;
  currentTarget: number;
}

export type Role = "admin" | "seller" | "superAdmin";

export interface saleData {
  amount: number;
  date: string;
}
export interface userDetail {
  sale: saleData[];
  user: userData;
}
