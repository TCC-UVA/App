import { DIContainer } from "@/src/di";
import { FactoryKeys } from "@/src/di/factories";
import { AuthService } from "@/src/services/auth";
import { LoginView } from "./view";
import { useLoginViewModel } from "./viewModel";

const LoginPage = () => {
  const service = DIContainer.getInstance().resolve<AuthService>(
    FactoryKeys.AuthService
  );
  const methods = useLoginViewModel(service);
  return <LoginView {...methods} />;
};

export default LoginPage;
