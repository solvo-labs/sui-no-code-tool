import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { WalletAccount } from "@wallet-standard/core";
import { SuiObjectResponse, type SuiClient } from "@mysten/sui.js/client";
import { existPush } from "../utils";
import { NftCollection, NftObject } from "../utils/types";

export default function useGetObjects(wallet: WalletAccount) {
  const [suiClient] = useOutletContext<[suiClient: SuiClient]>();
  const [nfts, setNfts] = useState<NftObject[]>([]);
  const [coins, setCoins] = useState<string[]>();
  const [treasuryCaps, setTreasuryCaps] = useState<SuiObjectResponse[]>();
  const [coinObjects, setCoinObjects] = useState<SuiObjectResponse[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [collections, setCollections] = useState<NftCollection[]>([]);

  useEffect(() => {
    const init = async () => {
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

      const packages: any = await suiClient.getOwnedObjects({
        owner: wallet.address,
        filter: {
          MatchAll: [
            {
              StructType: "0x2::package::UpgradeCap",
            },
          ],
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      const packageDetailsPromises = packages.data.map((pm: any) => {
        return suiClient.getObject({
          id: pm.data?.content.fields.package,
          options: {
            showBcs: true,
          },
        });
      });

      const packageDetails = await Promise.all(packageDetailsPromises);
      const collectionList: NftCollection[] = [];

      packageDetails.forEach((pm) => {
        if (pm.data.bcs.typeOriginTable && pm.data.bcs.typeOriginTable.length > 1) {
          if (pm.data.bcs.typeOriginTable[1].struct_name === "NFTMinted") {
            const collection_name: string = pm.data.bcs.typeOriginTable[0].struct_name;
            collectionList.push({ packageId: pm.data.objectId + "::" + collection_name.toLowerCase(), collectionName: collection_name });
          }
        }
      });

      console.log(collectionList);

      const nftObjectPromises = collectionList.map((cl) => {
        return suiClient.getOwnedObjects({
          owner: wallet.address,
          filter: {
            MatchAll: [
              {
                StructType: cl.packageId + "::" + cl.collectionName.toUpperCase(),
              },
            ],
          },
          options: {
            showContent: true,
            showType: true,
          },
        });
      });

      const nftObjects = await Promise.all(nftObjectPromises);

      // setNfts([nftObjects[0].data] as any);

      setCoins(coinList);
      setCoinObjects(coinObjs);
      setTreasuryCaps(tcaps);
      setLoading(false);
      setCollections(collectionList);
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

  return { coins, coinObjects, treasuryCaps, collections, objectLoading: loading, fetchCoinObjects };
}
