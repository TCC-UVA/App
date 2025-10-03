import { Layout } from "@/src/components/layout";
import { useRegisterViewModel } from "./viewModel";

export const RegisterView = ({}: ReturnType<typeof useRegisterViewModel>) => {
  return <Layout></Layout>;
};
