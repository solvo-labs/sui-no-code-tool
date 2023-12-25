import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { WalletAccount } from "@wallet-standard/core";

export default function useGetNFTs(wallet: WalletAccount) {
  const [suiClient] = useOutletContext<[suiClient: any]>();
  const [nfts, setNFTs] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      const result = await suiClient.getOwnedObjects({ owner: wallet.address });
      const resultAllObjects = result.data;

      const promiseData = resultAllObjects.map((obj: any) =>
        suiClient.getObject({
          id: obj.data.objectId,
          options: {
            showContent: true,
          },
        })
      );
      const finalResult = await Promise.all(promiseData);
      setNFTs(finalResult);
    };

    init();
  }, [suiClient, wallet]);

  return { nfts };
}
