import { api } from "../api";
import { CompareTwoWalletsRequestDto } from "./dto/compare-two-wallets-request.dto";
import { CreateWalletRequestDto } from "./dto/create-request.dto";
import { FindAllResponseDto } from "./dto/find-all-response.dto";
import { GetProfitsByWalletIdRequestDto } from "./dto/get-profits-by-wallet-id-request.dto";
import { UpdateWalletRequestDto } from "./dto/update-request.dto";
export interface WalletService {
  findAll: () => Promise<FindAllResponseDto>;
  create: (params: CreateWalletRequestDto) => Promise<string>;
  update: (params: UpdateWalletRequestDto) => Promise<void>;
  compareTwoWallets: (params: CompareTwoWalletsRequestDto) => Promise<void>;
  getProfitsByWalletId(params: GetProfitsByWalletIdRequestDto): Promise<void>;
  delete: (id: number) => Promise<void>;
}

export class WalletServiceHttp implements WalletService {
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

  async compareTwoWallets(params: CompareTwoWalletsRequestDto): Promise<void> {
    const response = await api.get(
      `/compare_portfolios/${params.firstWalletId}/${params.secondWalletId}/${params.initialDate}/${params.finalDate}`
    );

    return response.data;
  }

  async getProfitsByWalletId(
    params: GetProfitsByWalletIdRequestDto
  ): Promise<void> {
    const response = await api.get(`/portfolio_profitabilty_by_id`, {
      params: {
        portfolio_id: params.walletId,
        initial_date: params.initialDate,
        final_date: params.finalDate,
      },
    });
    return response.data;
  }
  async delete(id: number): Promise<void> {
    await api.delete(`/delete_portfolio/${id}`);
  }
}
