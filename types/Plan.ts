export interface Plan {
  _id: string;
  accountType: "Agent" | "Agency";
  name: string;
  __v: number;
  billingType: "monthly" | "yearly";
  createdAt: string;
  description: string;
  features: string[];
  isActive: boolean;
  price: number;
  updatedAt: string;
}
