import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { WalletAccount } from "@wallet-standard/core";
import { PaginatedObjectsResponse, type SuiClient } from "@mysten/sui.js/client";
import { NftObject } from "../utils/types";

export default function useGetObjects(wallet: WalletAccount) {
  const [suiClient] = useOutletContext<[suiClient: SuiClient]>();
  const [nfts, setNfts] = useState<NftObject[]>([]);
  const [coins, setCoins] = useState<PaginatedObjectsResponse>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      const nftObjects = await suiClient.getOwnedObjects({
        owner: wallet.address,
        filter: {
          MatchAll: [
            {
              StructType: "0x44d12155bb085df7d5432f0ad2419eb46195c449c327c716f43b733cfd17884d::devnet_nft::DevNetNFT",
            },
          ],
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      setNfts(nftObjects.data as any);

      const coinObjects = await suiClient.getOwnedObjects({
        owner: wallet.address,
        limit: 50,
        filter: {
          MatchAll: [
            {
              MoveModule: { package: "0x02", module: "coin" },
            },
          ],
        },
        options: {
          showType: true,
        },
      });

      setCoins(coinObjects);
      setLoading(false);
    };

    init();
  }, [suiClient, wallet]);

  const fetchCoinObjects = async (cursor?: string | null | undefined, limit: number = 10) => {
    const coinObjects = await suiClient.getOwnedObjects({
      owner: wallet.address,
      cursor,
      limit,
      filter: {
        MatchAll: [
          {
            MoveModule: { package: "0x02", module: "coin" },
          },
        ],
      },
      options: {
        showType: true,
      },
    });

    setCoins(coinObjects);
  };

  return { nfts, coins, objectLoading: loading, fetchCoinObjects };
}
