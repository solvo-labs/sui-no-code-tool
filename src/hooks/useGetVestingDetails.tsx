import { WalletAccount } from "@wallet-standard/base";
import { SuiClient, SuiObjectData } from "@mysten/sui.js/client";
import { useEffect, useState } from "react";
import { isAddressOwner, isMoveObject, isMoveStructArray, isMoveStructObject, isStringId, VESTING_PACKAGE_ID } from "../utils";
import { TVestingRecord, TVestingRecordContent } from "../utils/types";

export default function useGetVestingDetails(account: WalletAccount, suiClient: SuiClient, id: string) {
  const [vesting, setVesting] = useState<TVestingRecord>();

  useEffect(() => {
    const init = async () => {
      const treasuryObject = await suiClient.getOwnedObjects({
        owner: account.address,
        filter: {
          MatchAll: [
            {
              StructType: `${VESTING_PACKAGE_ID}::vesting_contract::VestingRecord`,
            },
          ],
        },
        options: {
          showContent: true,
          showType: true,
          showOwner: true,
        },
      });

      if (treasuryObject.data) {
        const data = treasuryObject.data;

        const filteredObject = data.filter((object) => {
          if (object.data) {
            return object.data.objectId === id;
          }
          return null;
        });
        if (filteredObject[0].data) {
          const objectData: SuiObjectData = filteredObject[0].data;

          if (objectData.content && isMoveObject(objectData.content)) {
            const content = objectData.content;
            const fields = objectData.content.fields;

            if (fields !== null && !isMoveStructArray(fields) && !isMoveStructObject(fields)) {
              const items = fields.items;

              if (isMoveStructObject(items)) {
                let id: { id: string } = { id: "" };
                let owner: string = "";
                let type: string = "";
                let name: string;

                id = isStringId(items.fields.id) ? items.fields.id : { id: "" };
                owner = objectData.owner && isAddressOwner(objectData.owner) ? objectData.owner.AddressOwner : "";
                type = objectData.type ? objectData.type : "";
                name = typeof fields.name === "string" && fields.name ? fields.name : "";

                let mainField: TVestingRecordContent = {
                  dataType: content.dataType,
                  fiels: {
                    id: id,
                    items: {
                      fields: {
                        id,
                        size: `${items.fields.size}`,
                      },
                      type: items.type,
                    },
                    name,
                  },
                  hasPublicTransfer: content.hasPublicTransfer,
                  type: content.type,
                };

                const vestingData: TVestingRecord = {
                  content: {
                    dataType: mainField.dataType,
                    fiels: {
                      id: mainField.fiels.id,
                      items: {
                        type: mainField.fiels.items.type,
                        fields: {
                          id: mainField.fiels.items.fields.id,
                          size: mainField.fiels.items.fields.size,
                        },
                      },
                      name: mainField.fiels.name,
                    },
                    hasPublicTransfer: mainField.hasPublicTransfer,
                    type: mainField.type,
                  },
                  digest: objectData.digest,
                  objectId: objectData.objectId,
                  owner,
                  type,
                  version: objectData.version,
                };
                setVesting(vestingData);
                console.log(vestingData);
              }
            }
          }
        } else {
          return null;
        }
      }
    };

    init();
  }, [suiClient, account, id]);

  return { vesting };
}
