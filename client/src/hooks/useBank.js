import { useContext } from "react";

// auth provider
import BankContext from "contexts/BankContext";

// ==============================|| AUTH HOOKS ||============================== //

const useBank = () => {
  const context = useContext(BankContext);

  if (!context) throw new Error("context must be use inside provider");

  return context;
};

export default useBank;
