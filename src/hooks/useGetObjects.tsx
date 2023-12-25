import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { WalletAccount } from "@wallet-standard/core";

export default function useGetObjects(wallet: WalletAccount) {
  const [suiClient] = useOutletContext<[suiClient: any]>();
  const [objects, setObjects] = useState<any[]>([]);
  const [nfts, setNfts] = useState<any[]>([]);
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      const allObjects = await Promise.all(promiseData);
      setObjects(allObjects);

      const nftObjects = allObjects.filter((fr) => fr.data.content.type === "0x44d12155bb085df7d5432f0ad2419eb46195c449c327c716f43b733cfd17884d::devnet_nft::DevNetNFT");
      setNfts(nftObjects);

      const coinObjects = allObjects.filter((fr) => (fr.data.content.type as string).startsWith("0x2::coin::"));
      setCoins(coinObjects);

      setLoading(false);
    };

    init();
  }, [suiClient, wallet]);

  return { objects, nfts, coins, loading };
}
