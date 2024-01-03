import { CoinStruct, SuiClient } from "@mysten/sui.js/client";
import { useEffect, useState } from "react";
import { getCoin, isAddressOwner, isCoinMetadata, isMoveObject, isObjectOwner, isSharedOwner } from "../utils";
import { CoinDetail } from "../utils/types";
import { WalletAccount } from "@wallet-standard/core";

export default function useGetCoinDetails(account: WalletAccount, suiClient: SuiClient, id: string, setLoading: any) {
  const [coin, setCoin] = useState<CoinDetail>();
  const [coinObjects, setCoinObjects] = useState<CoinStruct[]>();

  useEffect(() => {
    const init = async () => {
      try {
        const co = await suiClient.getCoins({ owner: account.address, coinType: id });
        if (co.data.length > 0) {
          setCoinObjects(co.data);
        }

        const coinDetails = await getCoin(suiClient, id);

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
        const to = treasuryObject.data[0];

        if (to.data) {
          const data = to.data;
          if (isMoveObject(data.content!) && isCoinMetadata(coinDetails) && data.type) {
            const metadata = coinDetails.metadata;
            let ownerAddress: string = "";
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            isAddressOwner(data.owner!)
              ? (ownerAddress = data.owner.AddressOwner)
              : isObjectOwner(data.owner!)
              ? (ownerAddress = data.owner.ObjectOwner)
              : isSharedOwner(data.owner!)
              ? (ownerAddress = data.owner.Shared.initial_shared_version)
              : "Immutable";

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
        }
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, []);

  return { coin, coinObjects };
}
