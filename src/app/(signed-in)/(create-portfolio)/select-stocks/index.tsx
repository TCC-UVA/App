import { DIContainer } from "@/src/di";
import { FactoryKeys } from "@/src/di/factories";
import { StockService } from "@/src/services/stocks";
import { SelectStocksView } from "./view";
import { useSelectStocksViewModel } from "./viewModel";

const SelectStocks = () => {
  const service = DIContainer.getInstance().resolve<StockService>(
    FactoryKeys.StockService
  );
  const methods = useSelectStocksViewModel(service);

  return <SelectStocksView {...methods} />;
};

export default SelectStocks;
