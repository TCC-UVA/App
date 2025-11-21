export interface FindAllResponseDto {
  [x: string]: {
    PortfolioId: number;
    Assets: {
      name: string;
      allocation: number;
    }[];
  };
}
