import { Quote } from "@/src/models/quote";
import { createContext, PropsWithChildren, useContext, useState } from "react";

interface CreatePortfolioContextType {
  selectedStocks: Quote[];
  setSelectedStocks: (stocks: Quote[]) => void;
  name: string;
  setName: (name: string) => void;
}

export const CreatePortfolioContext = createContext<CreatePortfolioContextType>(
  {} as CreatePortfolioContextType
);

export const CreatePortfolioProvider = ({ children }: PropsWithChildren) => {
  const [selectedStocks, setSelectedStocks] = useState<Quote[]>([]);
  const [name, setName] = useState("");
  return (
    <CreatePortfolioContext.Provider
      value={{ selectedStocks, setSelectedStocks, name, setName }}
    >
      {children}
    </CreatePortfolioContext.Provider>
  );
};

export const useCreatePortfolioContext = () => {
  const context = useContext(CreatePortfolioContext);
  if (!context) {
    throw new Error(
      "useCreatePortfolioContext must be used within a CreatePortfolioProvider"
    );
  }
  return context;
};
