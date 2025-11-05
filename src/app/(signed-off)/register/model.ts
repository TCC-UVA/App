import { isValidDate } from "@/src/utils/valid-date";
import * as yup from "yup";

export const registerSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  birthDate: yup
    .string()
    .required("Data de nascimento é obrigatória")
    .test("is-valid-date", "Data inválida (DD/MM/AAAA)", isValidDate),
  password: yup
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .required("Senha é obrigatória"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas devem corresponder")
    .required("Confirmação de senha é obrigatória"),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
