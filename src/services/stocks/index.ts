import { mockStocks } from "@/src/mock/stocks";
import { Stock } from "@/src/models";
import { financialApi } from "../api";
import { SearchAssetsResponseDto } from "./dto/search-assets-response.dto";

export interface StockService {
  get: () => Promise<Stock[]>;
  searchAssets: (search: string) => Promise<SearchAssetsResponseDto>;
}

export class StockServiceHttp implements StockService {
  async searchAssets(search: string): Promise<SearchAssetsResponseDto> {
    const response = await financialApi.get<SearchAssetsResponseDto>(
      "/search",
      {
        params: { q: search },
      }
    );
    return response.data;
  }

  async get(): Promise<Stock[]> {
    const data = await new Promise<Stock[]>((resolve) => {
      setTimeout(() => {
        resolve(mockStocks);
      }, 1000);
    });
    return data;
  }
}
