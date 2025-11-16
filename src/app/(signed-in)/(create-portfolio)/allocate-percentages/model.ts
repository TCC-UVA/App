import * as Yup from "yup";

export const allocatePercentagesSchema = Yup.object().shape({
  allocations: Yup.array()
    .of(
      Yup.object().shape({
        symbol: Yup.string().required(),
        percentage: Yup.number()
          .min(0, "Porcentagem deve ser maior ou igual a 0")
          .max(100, "Porcentagem deve ser menor ou igual a 100")
          .required("Porcentagem é obrigatória"),
      })
    )
    .required()
    .test("total-percentage", "A soma deve ser exatamente 100%", (value) => {
      if (!value) return false;
      const total = value.reduce(
        (sum, item) => sum + (item.percentage || 0),
        0
      );
      return Math.abs(total - 100) < 0.01;
    }),
});

export type AllocatePercentagesFormData = Yup.InferType<
  typeof allocatePercentagesSchema
>;

export interface StockAllocation {
  Name: string;
  Allocation: number;
}
