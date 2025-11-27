import { WalletService } from "..";
import { CompareTwoWalletsRequestDto } from "../dto/compare-two-wallets-request.dto";
import { CompareTwoWalletsResponseDto } from "../dto/compare-two-wallets-response.dto";
import { CreateWalletRequestDto } from "../dto/create-request.dto";
import { FindAllResponseDto } from "../dto/find-all-response.dto";
import { GetAIInsightsRequestDto } from "../dto/get-ai-insights-request.dto";
import { GetProfitsByWalletIdRequestDto } from "../dto/get-profits-by-wallet-id-request.dto";
import { GetProfitsByWalletIdResponseDto } from "../dto/get-profits-by-wallet-id-response.dto";
import { UpdateWalletRequestDto } from "../dto/update-request.dto";

export class WalletServiceInMemory implements WalletService {
  async compareTwoWallets(
    params: CompareTwoWalletsRequestDto
  ): Promise<CompareTwoWalletsResponseDto> {
    return Promise.resolve({
      "Portfolio 1": {
        PortfolioId: 1,
        PortfolioName: "Carteira 1",
        ConsolidatedProfitability: "-12.34%",
        FinalDate: Number(params.finalDate),
        InitialDate: Number(params.initialDate),
        Assets: {
          "MOVI3.SA": "-66.42%",
          "RENT3.SA": "-10.25%",
          "RAPT4.SA": "5.67%",
        },
      },
      "Portfolio 2": {
        PortfolioId: 2,
        PortfolioName: "Carteira 2",
        ConsolidatedProfitability: "8.90%",
        FinalDate: Number(params.finalDate),
        InitialDate: Number(params.initialDate),
        Assets: {
          "ABCD3.SA": "15.30%",
          "EFGH4.SA": "7.25%",
          "IJKL4.SA": "-3.10%",
        },
      },
      AbsoluteDifference: "21.24%",
    });
  }
  async getProfitsByWalletId(
    params: GetProfitsByWalletIdRequestDto
  ): Promise<GetProfitsByWalletIdResponseDto> {
    return Promise.resolve({
      InitialDate: Number(params.initial_year),
      FinalDate: Number(params.final_year),
      ConsolidatedProfitability: "4.56%",
      Assets: {
        "ABCD3.SA": "10.25%",
        "EFGH4.SA": "20.15%",
        "IJKL4.SA": "5.50%",
      },
    } as GetProfitsByWalletIdResponseDto);
  }
  getAIInsights(params: GetAIInsightsRequestDto): Promise<string> {
    return Promise.resolve(
      "These are the AI-generated insights for your wallet."
    );
  }
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

  delete(id: number): Promise<void> {
    return Promise.resolve();
  }
}
