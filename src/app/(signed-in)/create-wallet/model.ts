import * as yup from "yup";

export const createWalletSchema = yup.object().shape({
  name: yup.string().required("O nome da carteira é obrigatório"),
  description: yup.string().optional(),
});

export type CreateWalletFormData = yup.InferType<typeof createWalletSchema>;
