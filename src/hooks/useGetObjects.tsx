import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { WalletAccount } from "@wallet-standard/core";
import { SuiObjectResponse, type SuiClient } from "@mysten/sui.js/client";
import { NftObject } from "../utils/types";
import { existPush } from "../utils";

export default function useGetObjects(wallet: WalletAccount) {
  const [suiClient] = useOutletContext<[suiClient: SuiClient]>();
  const [nfts, setNfts] = useState<NftObject[]>([]);
  const [coins, setCoins] = useState<string[]>();
  const [treasuryCaps, setTreasuryCaps] = useState<SuiObjectResponse[]>();
  const [coinObjects, setCoinObjects] = useState<SuiObjectResponse[]>();
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
              MoveModule: { package: "0x2", module: "coin" },
            },
          ],
        },
        options: {
          showType: true,
          showContent: true,
        },
      });

      let tcaps: SuiObjectResponse[] = [];
      let coinObjs: SuiObjectResponse[] = [];
      let coinList: string[] = [];

      const regex = /<([^>]*)>/;

      coinObjects.data.forEach((cb: SuiObjectResponse) => {
        const type = cb.data?.type;

        if (type === "0x2::coin::Coin<0x2::sui::SUI>") {
          return;
        }

        if (type !== null && type !== undefined) {
          const val = (type?.match(regex) || [])[1] || "";

          existPush(coinList, val);
        }

        if (type && type.startsWith("0x2::coin::Coin")) {
          coinObjs.push(cb);
        } else if (type?.startsWith("0x2::coin::TreasuryCap")) {
          tcaps.push(cb);
        }
      });

      console.log(coinList);
      setCoins(coinList);
      setCoinObjects(coinObjs);
      setTreasuryCaps(tcaps);
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

    return coinObjects;
  };

  return { nfts, coins, coinObjects, treasuryCaps, objectLoading: loading, fetchCoinObjects };
}
