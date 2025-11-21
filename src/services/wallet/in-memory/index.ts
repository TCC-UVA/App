import { WalletService } from "..";
import { CompareTwoWalletsRequestDto } from "../dto/compare-two-wallets-request.dto";
import { CreateWalletRequestDto } from "../dto/create-request.dto";
import { FindAllResponseDto } from "../dto/find-all-response.dto";
import { UpdateWalletRequestDto } from "../dto/update-request.dto";

export class WalletServiceInMemory implements WalletService {
  async findAll(): Promise<FindAllResponseDto> {
    return Promise.resolve({
      portfolios: {
        PortfolioId: 1,
        Assets: [
          {
            name: "BOVA11",
            allocation: 50,
          },
          {
            name: "VALE3",
            allocation: 30,
          },
          {
            name: "PETR4",
            allocation: 20,
          },
        ],
      },
      carteira: {
        PortfolioId: 2,
        Assets: [
          {
            name: "ITUB4",
            allocation: 40,
          },
          {
            name: "ABCD3",
            allocation: 35,
          },
          {
            name: "EFGH4",
            allocation: 25,
          },
        ],
      },
      outra: {
        PortfolioId: 3,
        Assets: [
          {
            name: "XYZW3",
            allocation: 60,
          },
          {
            name: "LMNO4",
            allocation: 40,
          },
        ],
      },
    });
  }
  create(params: CreateWalletRequestDto): Promise<string> {
    return Promise.resolve("new-wallet-id");
  }
  update(params: UpdateWalletRequestDto): Promise<void> {
    return Promise.resolve();
  }
  compareTwoWallets(params: CompareTwoWalletsRequestDto): Promise<void> {
    return Promise.resolve();
  }
  getProfitsByWalletId(): Promise<void> {
    return Promise.resolve();
  }
  delete(id: number): Promise<void> {
    return Promise.resolve();
  }
}
