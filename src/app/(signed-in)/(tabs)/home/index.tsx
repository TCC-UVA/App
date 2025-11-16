import { DIContainer } from "@/src/di";
import { FactoryKeys } from "@/src/di/factories";
import { WalletService } from "@/src/services/wallet";
import { HomeView } from "./view";
import { useHomeViewModel } from "./viewModel";

const Home = () => {
  const service = DIContainer.getInstance().resolve<WalletService>(
    FactoryKeys.WalletService
  );
  const methods = useHomeViewModel(service);
  return <HomeView {...methods} />;
};

export default Home;
