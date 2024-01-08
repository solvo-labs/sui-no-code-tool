import { useEffect, useState } from "react";
import { CoinBalance, SuiClient } from "@mysten/sui.js/client";
import { WalletAccount } from "@wallet-standard/core";

export function useGetTotalSupply(suiClient: SuiClient, account: WalletAccount, coinType: string) {
  const [currentBalance, setCurrentBalance] = useState<string>();

  useEffect(() => {
    const init = async () => {
      const currentBalanceData: CoinBalance = await suiClient.getBalance({
        owner: account.address,
        coinType,
      });
      setCurrentBalance(currentBalanceData.totalBalance);
    };
    init();
  }, []);

  return { currentBalance };
}
