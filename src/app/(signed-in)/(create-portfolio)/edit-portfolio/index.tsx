import { WalletServiceHttp } from "@/src/services/wallet";
import { EditPortfolioView } from "./view";
import { useEditPortfolioViewModel } from "./viewModel";

export default function EditPortfolioScreen() {
  const walletService = new WalletServiceHttp();
  const viewModel = useEditPortfolioViewModel(walletService);

  return <EditPortfolioView {...viewModel} />;
}
