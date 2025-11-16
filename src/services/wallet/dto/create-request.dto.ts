export interface CreateWalletRequestDto {
  name: string;
  assets: {
    Allocation: number;
    Name: string;
  }[];
}
