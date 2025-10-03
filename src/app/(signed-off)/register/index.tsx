import { DIContainer } from "@/src/di";
import { FactoryKeys } from "@/src/di/factories";
import { AuthService } from "@/src/services/auth";
import { RegisterView } from "./view";
import { useRegisterViewModel } from "./viewModel";

const RegisterPage = () => {
  const service = DIContainer.getInstance().resolve<AuthService>(
    FactoryKeys.AuthService
  );
  const methods = useRegisterViewModel(service);

  return <RegisterView {...methods} />;
};

export default RegisterPage;
