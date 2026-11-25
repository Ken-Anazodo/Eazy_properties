export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  accountType: "Agent" | "Agency";
}
