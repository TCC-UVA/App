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

export const mockWallets: Wallet[] = [
  {
    id: "1",
    name: "Dividendos",
    description: "Carteira focada em empresas pagadoras de dividendos",
    stocksCount: 8,
    createdAt: "15/01/2025",
    updatedAt: "2025-01-15T10:00:00Z",
    totalValue: 45320.50,
    totalProfit: 3240.80,
    profitPercentage: 7.68,
  },
  {
    id: "2",
    name: "Growth Tech",
    description: "Empresas de tecnologia com potencial de crescimento",
    stocksCount: 5,
    createdAt: "10/01/2025",
    updatedAt: "2025-01-10T14:30:00Z",
    totalValue: 28150.00,
    totalProfit: -1240.30,
    profitPercentage: -4.22,
  },
  {
    id: "3",
    name: "Banco e Financeiro",
    description: "Setor bancário e instituições financeiras",
    stocksCount: 4,
    createdAt: "05/01/2025",
    updatedAt: "2025-01-05T09:15:00Z",
    totalValue: 19800.00,
    totalProfit: 1580.20,
    profitPercentage: 8.68,
  },
  {
    id: "4",
    name: "Small Caps",
    description: "Pequenas empresas com alto potencial",
    stocksCount: 12,
    createdAt: "28/12/2024",
    updatedAt: "2024-12-28T16:45:00Z",
    totalValue: 15600.75,
    totalProfit: 892.40,
    profitPercentage: 6.07,
  },
  {
    id: "5",
    name: "Energia Renovável",
    stocksCount: 3,
    createdAt: "20/12/2024",
    updatedAt: "2024-12-20T11:20:00Z",
    totalValue: 12340.00,
    totalProfit: 540.00,
    profitPercentage: 4.57,
  },
];

export const mockEmptyWallets: Wallet[] = [];

export const mockSingleWallet: Wallet = {
  id: "6",
  name: "Minha Primeira Carteira",
  description: "Começando a investir em ações",
  stocksCount: 0,
  createdAt: "20/01/2025",
  updatedAt: "2025-01-20T08:00:00Z",
  totalValue: 0,
  totalProfit: 0,
  profitPercentage: 0,
};
