import { mockWallets, Wallet } from "@/src/mock/wallets";
import { api } from "../api";
import { CreateWalletRequestDto } from "./dto/create-request.dto";
export interface WalletService {
  findAll: () => Promise<Wallet[]>;
  findById: (id: string) => Promise<Wallet | null>;
  create: (params: CreateWalletRequestDto) => Promise<Wallet>;
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
  async create(params: CreateWalletRequestDto): Promise<any> {
    const data = await api.post("/portfolio", {
      Name: params.name,
      Assets: params.assets,
    });
    return data;
  }

  async findAll(): Promise<Wallet[]> {
    const data = await new Promise<Wallet[]>((resolve) => {
      setTimeout(() => {
        resolve(mockWallets);
      }, 1000);
    });
    return data;
  }
}
