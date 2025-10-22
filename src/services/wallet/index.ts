import { mockWallets, Wallet } from "@/src/mock/wallets";

export interface WalletService {
  findAll: () => Promise<Wallet[]>;
  findById: (id: string) => Promise<Wallet | null>;
  create: (wallet: Wallet) => Promise<Wallet>;
}

export class WalletServiceHttp implements WalletService {
  findById: (id: string) => Promise<Wallet | null> = async (id: string) => {
    const data = await new Promise<Wallet | null>((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 1000);
    });
    return data;
  };
  create: (wallet: Wallet) => Promise<Wallet> = async (wallet: Wallet) => {
    const data = await new Promise<Wallet>((resolve) => {
      setTimeout(() => {
        resolve(wallet);
      }, 1000);
    });
    return data;
  };
  async findAll(): Promise<Wallet[]> {
    const data = await new Promise<Wallet[]>((resolve) => {
      setTimeout(() => {
        resolve(mockWallets);
      }, 1000);
    });
    return data;
  }
}
