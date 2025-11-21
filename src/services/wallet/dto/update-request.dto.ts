export interface UpdateWalletRequestDto {
  id: number;
  assets: {
    Allocation: number;
    Name: string;
  }[];
}
