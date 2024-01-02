import { SuiClient, SuiObjectResponse } from "@mysten/sui.js/client";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { NftObject } from "../utils/types";
import { isAddressOwner, isMoveObject, isMoveStructArray, isMoveStructObject, isObjectOwner, isSharedOwner } from "../utils";

export default function useGetNftDetails(objectID: string) {
  const [suiClient] = useOutletContext<[suiClient: SuiClient]>();
  const [nftDetail, setNftDetail] = useState<NftObject>();

  useEffect(() => {
    const init = async () => {
      try {
        const response: SuiObjectResponse = await suiClient.getObject({
          id: objectID,
          options: {
            showContent: true,
            showOwner: true,
            showPreviousTransaction: true,
            showType: true,
            showStorageRebate: true,
          },
        });

        if (response.data) {
          const data = response.data;
          if (isMoveObject(data.content!)) {
            const fieldData = data.content.fields;
            let ownerAddress: string = "";
            let mainField = { name: "", description: "", url: "" };

            if (!isMoveStructArray(fieldData) && !isMoveStructObject(fieldData)) {
              mainField = { name: `${fieldData.name}`, description: `${fieldData.description}`, url: `${fieldData.url}` };
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            isAddressOwner(data.owner!)
              ? (ownerAddress = data.owner.AddressOwner)
              : isObjectOwner(data.owner!)
              ? (ownerAddress = data.owner.ObjectOwner)
              : isSharedOwner(data.owner!)
              ? (ownerAddress = data.owner.Shared.initial_shared_version)
              : "Immutable";

            setNftDetail({
              ...nftDetail,
              data: {
                content: {
                  dataType: data.content.dataType,
                  fields: {
                    name: mainField.name,
                    description: mainField.description,
                    url: mainField.url,
                  },
                  hasPublicTransfer: data.content.hasPublicTransfer,
                },
                objectId: data.objectId,
                owner: ownerAddress,
                previousTransaction: data.previousTransaction!,
                storageRebate: data.storageRebate!,
                type: data.type!,
                version: data.version!,
              },
            });
          }
        } else if (response.error) {
          console.log("Error");
        }
      } catch (error) {
        console.log(error);
      }
    };

    init();
  }, [nftDetail, objectID, suiClient]);

  return { nftDetail };
}
