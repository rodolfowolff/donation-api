export interface IDonation {
  ongId: string;
  value: number;
  type?: "PIX" | "CASH" | "CREDIT_CARD" | "FOOD" | "CLOTHING" | "FURNITURE" | "ELETRONIC" | "OTHER";
  status?: "PENDING" | "CONFIRMED" | "CANCELED";
}
