export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isPopular: boolean;
}

export type PaymentType = "現金" | "信用卡" | "行動支付";

export interface Reservation {
  id?: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  dateTime: string;
  paymentType: PaymentType;
  guests: number;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  createdAt: string;
}
