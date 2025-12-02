import { api } from "../api";
import { ComparePortfolioBenchmarkRequestDto } from "./dto/compare-portfolio-benchmark-request.dto";
import { ComparePortfolioBenchmarkResponseDto } from "./dto/compare-portfolio-benchmark-response.dto";
import { CompareTwoWalletsRequestDto } from "./dto/compare-two-wallets-request.dto";
import { CompareTwoWalletsResponseDto } from "./dto/compare-two-wallets-response.dto";
import { CreateWalletRequestDto } from "./dto/create-request.dto";
import { FindAllResponseDto } from "./dto/find-all-response.dto";
import { GetAIInsightsBenchmarkRequestDto } from "./dto/get-ai-insights-benchmark-request.dto";
import { GetAIInsightsRequestDto } from "./dto/get-ai-insights-request.dto";
import { GetDividendsYieldByWalletIdResponseDto } from "./dto/get-dividends-yield-by-wallet-id-response.dto";
import { GetProfitsByWalletIdRequestDto } from "./dto/get-profits-by-wallet-id-request.dto";
import { GetProfitsByWalletIdResponseDto } from "./dto/get-profits-by-wallet-id-response.dto";
import { UpdateWalletRequestDto } from "./dto/update-request.dto";
export interface WalletService {
  findAll: () => Promise<FindAllResponseDto>;
  create: (params: CreateWalletRequestDto) => Promise<string>;
  update: (params: UpdateWalletRequestDto) => Promise<void>;
  compareTwoWallets: (
    params: CompareTwoWalletsRequestDto
  ) => Promise<CompareTwoWalletsResponseDto>;
  getDividendsByWalletId: (
    params: GetProfitsByWalletIdRequestDto
  ) => Promise<GetDividendsYieldByWalletIdResponseDto>;
  getProfitsByWalletId(
    params: GetProfitsByWalletIdRequestDto
  ): Promise<GetProfitsByWalletIdResponseDto>;
  getAIInsights(params: GetAIInsightsRequestDto): Promise<string>;
  getAIInsightsBenchmark(
    params: GetAIInsightsBenchmarkRequestDto
  ): Promise<string>;
  delete: (id: number) => Promise<void>;
  comparePortfolioWithBenchmark: (
    params: ComparePortfolioBenchmarkRequestDto
  ) => Promise<ComparePortfolioBenchmarkResponseDto>;
}

export class WalletServiceHttp implements WalletService {
  async getDividendsByWalletId(
    params: GetProfitsByWalletIdRequestDto
  ): Promise<GetDividendsYieldByWalletIdResponseDto> {
    const response = await api.get<GetDividendsYieldByWalletIdResponseDto>(
      `/portfolio_dividend_yield`,
      {
        params: {
          portfolio_id: params.walletId,
          initial_year: params.initial_year,
          final_year: params.final_year,
        },
      }
    );
    return response.data;
  }
  async getAIInsightsBenchmark(
    params: GetAIInsightsBenchmarkRequestDto
  ): Promise<string> {
    const response = await api.post<string>(
      `/gemini_compare_portfolio_benchmark`,
      {
        ...params,
      }
    );
    return response.data;
  }
  async comparePortfolioWithBenchmark(
    params: ComparePortfolioBenchmarkRequestDto
  ): Promise<ComparePortfolioBenchmarkResponseDto> {
    const response = await api.get<ComparePortfolioBenchmarkResponseDto>(
      `/compare_portfolio_with_benchmark/${params.walletId}/${params.benchmark}/${params.initialYear}/${params.finalYear}`
    );
    return response.data;
  }
  async create(params: CreateWalletRequestDto): Promise<string> {
    const response = await api.post("/portfolio", {
      Name: params.name,
      Assets: params.assets,
    });
    return response.data;
  }

  async findAll(): Promise<FindAllResponseDto> {
    const response = await api.get<FindAllResponseDto>("/portfolios_by_codcli");

    return response.data;
  }

  async update({ id, assets }: UpdateWalletRequestDto): Promise<void> {
    await api.patch(`/update_portfolio_assets/${id}`, {
      Assets: assets,
    });
  }

  async compareTwoWallets(
    params: CompareTwoWalletsRequestDto
  ): Promise<CompareTwoWalletsResponseDto> {
    const response = await api.get<CompareTwoWalletsResponseDto>(
      `/compare_portfolios/${params.firstWalletId}/${params.secondWalletId}/${params.initialDate}/${params.finalDate}`
    );

    return response.data;
  }

  async getProfitsByWalletId(
    params: GetProfitsByWalletIdRequestDto
  ): Promise<GetProfitsByWalletIdResponseDto> {
    const response = await api.get<GetProfitsByWalletIdResponseDto>(
      `/portfolio_profitabilty_by_id`,
      {
        params: {
          portfolio_id: params.walletId,
          initial_year: params.initial_year,
          final_year: params.final_year,
        },
      }
    );
    return response.data;
  }

  async getAIInsights(params: GetAIInsightsRequestDto): Promise<string> {
    const response = await api.post<string>(`/gemini_portfolio_profitability`, {
      ...params,
    });
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/delete_portfolio/${id}`);
  }
}
