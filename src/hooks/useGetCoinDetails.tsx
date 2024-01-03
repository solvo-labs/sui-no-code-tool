import { CoinStruct, SuiClient } from "@mysten/sui.js/client";
import { useEffect, useState } from "react";
import { getCoin, isCoinMetadata, isMoveObject, ownerChecker } from "../utils";
import { CoinDetail } from "../utils/types";
import { WalletAccount } from "@wallet-standard/core";

export default function useGetCoinDetails(account: WalletAccount, suiClient: SuiClient, id: string, setLoading: any) {
  const [coin, setCoin] = useState<CoinDetail>();
  const [coinObjects, setCoinObjects] = useState<CoinStruct[]>();

  useEffect(() => {
    const init = async () => {
      try {
        const co = await suiClient.getCoins({ owner: account.address, coinType: id });
        const coinDetails = await getCoin(suiClient, id);
        let treasury: any = {};
        if (co.data.length > 0) {
          setCoinObjects(co.data);
        }

        try {
          const treasuryObject = await suiClient.getObject({
            id: co.data[0].coinObjectId,
            options: {
              showContent: true,
              showType: true,
              showOwner: true,
            },
          });
          treasury = treasuryObject;
        } catch {
          const treasuryObject = await suiClient.getOwnedObjects({
            owner: account.address,
            filter: {
              MatchAll: [
                {
                  StructType: "0x2::coin::TreasuryCap<" + id + ">",
                },
              ],
            },
            options: {
              showContent: true,
              showType: true,
              showOwner: true,
            },
          });
          treasury = treasuryObject.data[0];
        }

        if (treasury.data) {
          const data = treasury.data;

          if (isMoveObject(data.content!) && isCoinMetadata(coinDetails) && data.type) {
            const metadata = coinDetails.metadata;

            const ownerAddress = ownerChecker(data.owner!);

            const coinDetailData: CoinDetail = {
              metadata: metadata,
              supply: coinDetails.supply,
              content: {
                dataType: data.content.dataType,
                hasPublicTransfer: data.content.hasPublicTransfer,
              },
              digest: data.digest,
              objectId: data.objectId,
              type: data.type,
              version: data.version,
              owmer: ownerAddress,
            };
            setCoin(coinDetailData);
            setLoading(false);
          }
        } else if (treasury.error) {
          console.log(treasury.error.code);
        }
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, []);

  return { coin, coinObjects };
}
