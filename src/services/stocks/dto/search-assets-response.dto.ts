import { Quote } from "@/src/models/quote";

export interface SearchAssetsResponseDto {
  count: number;
  quotes: Quote[];
}
