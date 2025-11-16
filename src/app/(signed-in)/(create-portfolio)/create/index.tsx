import { CreateWalletView } from "./view";
import { useCreateWalletViewModel } from "./viewModel";

const CreateWallet = () => {
  const methods = useCreateWalletViewModel();

  return <CreateWalletView {...methods} />;
};

export default CreateWallet;
