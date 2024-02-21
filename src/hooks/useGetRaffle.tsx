import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { PACKAGE_ID, RAFFLES } from "../utils";
import { WalletAccount } from "@wallet-standard/base";
import { useEffect, useState } from "react";
import { BCS, getSuiMoveConfig } from "@mysten/bcs";

export default function useGetRaffle(suiClient: SuiClient, account: WalletAccount) {
  const [multiObjects, setMultiObjects] = useState<any>();
  const [loading, setLoading] = useState<Boolean>(true);

  // ref ->https://github.com/juzybits/polymedia-profile/blob/a701cae44d033cbafd657d5e8fb5b2563f97382a/sdk/src/profile.ts#L351
  useEffect(() => {
    const getRaffles = async () => {
      const tx = new TransactionBlock();

      // enter custom raffles
      tx.moveCall({
        target: `${PACKAGE_ID}::coin_raffle::get_raffles`,
        arguments: [tx.object(RAFFLES)],
      });

      const response = await suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: account.address,
      });

      if (response.results && response.results[0].returnValues) {
        const values = response.results[0].returnValues[0];

        const valueType = values[1];
        const valueData = Uint8Array.from(values[0]);

        const bcs = new BCS(getSuiMoveConfig());
        const raffleObjects = bcs.de(valueType, valueData, "hex");
        const multiObjects = await getMultiObjects(raffleObjects);

        setMultiObjects(multiObjects);
        setLoading(false);
      }
    };

    getRaffles();
  }, []);

  const getMultiObjects = async (objectIds: any) => {
    try {
      const result = await suiClient.multiGetObjects({
        ids: objectIds,
        options: { showContent: true },
      });

      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  return { multiObjects, loading };
}
