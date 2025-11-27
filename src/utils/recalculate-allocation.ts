import { Asset } from "../models";

type RedistributePercentagesParams = {
  assets: Asset[];
  deletedIds: string[];
  decimalPlaces?: number;
};

export const recalculateAllocation = ({
  deletedIds,
  assets,
  decimalPlaces,
}: RedistributePercentagesParams) => {
  const remaining = assets.filter((p) => !deletedIds.includes(p.name));
  if (remaining.length === 0) {
    throw new Error("Não é possível deletar todos os itens");
  }

  const totalRemaining = remaining.reduce((sum, p) => sum + p.allocation, 0);

  return remaining.map((p) => ({
    ...p,
    allocation: Number(
      ((p.allocation / totalRemaining) * 100).toFixed(decimalPlaces)
    ),
  }));
};
