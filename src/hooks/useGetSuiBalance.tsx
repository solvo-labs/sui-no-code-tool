import { CoinBalance, SuiClient } from "@mysten/sui.js/client";
import { WalletAccount } from "@wallet-standard/core";
import { useEffect, useState } from "react";

export default function useGetSuiBalance(account: WalletAccount, suiClient: SuiClient) {
  const [suiBalance, setSuiBalance] = useState<CoinBalance>();

  useEffect(() => {
    const init = async () => {
      const suiBalance = await suiClient.getBalance({ owner: account?.address! });
      setSuiBalance(suiBalance);
    };

    init();
  }, []);

  return { suiBalance };
}
