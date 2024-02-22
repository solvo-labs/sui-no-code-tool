import { useCurrentAccount } from "@mysten/dapp-kit";
import { SuiClient } from "@mysten/sui.js/client";
import { useOutletContext } from "react-router-dom";
import useGetSuiBalance from "../hooks/useGetSuiBalance";

const Main = () => {
  const account = useCurrentAccount();
  const [suiClient] = useOutletContext<[suiClient: SuiClient]>();
  const { suiBalance } = useGetSuiBalance(account!, suiClient);

  return (
    <div>
      <p>Total Balance: {suiBalance ? Number(suiBalance?.totalBalance) / Math.pow(10, 9) : "0"}</p>
    </div>
  );
};

export default Main;
