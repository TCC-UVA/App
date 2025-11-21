import * as Yup from "yup";

export const allocateQuantitiesSchema = Yup.object().shape({
  allocations: Yup.array()
    .of(
      Yup.object().shape({
        symbol: Yup.string().required(),
        quantity: Yup.number()
          .min(0, "Quantidade deve ser maior ou igual a 0")
          .integer("Quantidade deve ser um número inteiro")
          .required("Quantidade é obrigatória"),
      })
    )
    .required()
    .test("at-least-one", "Adicione pelo menos uma ação", (value) => {
      if (!value) return false;
      const total = value.reduce((sum, item) => sum + (item.quantity || 0), 0);
      return total > 0;
    }),
});

export type AllocateQuantitiesFormData = Yup.InferType<
  typeof allocateQuantitiesSchema
>;

export interface StockAllocation {
  Name: string;
  Allocation: number;
}
