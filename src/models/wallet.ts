export interface Wallet {
  id: string;
  name: string;
  description?: string;
  stocksCount: number;
  createdAt: string;
  updatedAt: string;
  totalValue?: number;
  totalProfit?: number;
  profitPercentage?: number;
}
