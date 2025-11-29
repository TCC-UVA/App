import * as Yup from "yup";

export const allocateQuantitiesSchema = Yup.object().shape({
  allocations: Yup.array()
    .of(
      Yup.object().shape({
        symbol: Yup.string().required(),
        quantity: Yup.number()
          .min(1, "Percentual deve ser maior ou igual a 1")
          .max(100, "Percentual deve ser menor ou igual a 100")
          .required("Percentual é obrigatório"),
      })
    )
    .required()
    .test("total-100", "O total deve ser exatamente 100%", (value) => {
      if (!value) return false;
      const total = value.reduce((sum, item) => sum + (item.quantity || 0), 0);
      return total === 100;
    })
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
