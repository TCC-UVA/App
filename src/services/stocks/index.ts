import { mockStocks } from "@/src/mock/stocks";
import { Stock } from "@/src/models";

export interface StockService {
  get: () => Promise<Stock[]>;
}

export class StockServiceHttp implements StockService {
  async get(): Promise<Stock[]> {
    const data = await new Promise<Stock[]>((resolve) => {
      setTimeout(() => {
        resolve(mockStocks);
      }, 1000);
    });
    return data;
  }
}
