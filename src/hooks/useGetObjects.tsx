import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { WalletAccount } from "@wallet-standard/core";
import { type SuiClient } from "@mysten/sui.js/client";

export default function useGetObjects(wallet: WalletAccount) {
  const [suiClient] = useOutletContext<[suiClient: SuiClient]>();
  const [objects, setObjects] = useState<any[]>([]);
  const [nfts, setNfts] = useState<any[]>([]);
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      const objects = await suiClient.getOwnedObjects({ owner: wallet.address });
      const resultAllObjects = objects.data;

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

      const nftObjects: any[] = [];
      const coinObjects: any[] = [];

      allObjects.forEach((fr: any) => {
        if (fr.data) {
          const type = fr.data.content?.type;

          if (type === "0x44d12155bb085df7d5432f0ad2419eb46195c449c327c716f43b733cfd17884d::devnet_nft::DevNetNFT") {
            const isExist = nftObjects.findIndex((cb) => cb.data.content?.type === type);

            if (isExist < 0) nftObjects.push(fr);
          }

          if (type.startsWith("0x2::coin::") && type !== "0x2::coin::Coin<0x2::sui::SUI>") {
            const isExist = coinObjects.findIndex((cb) => cb.data.content?.type === type);

            if (isExist < 0) coinObjects.push(fr);
          }
        }
      });

      setNfts(nftObjects);
      setCoins(coinObjects);

      setLoading(false);
    };

    init();
  }, [suiClient, wallet]);

  return { objects, nfts, coins, objectLoading: loading };
}