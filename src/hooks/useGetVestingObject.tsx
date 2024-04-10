import { PaginatedObjectsResponse, SuiClient, SuiObjectResponse } from "@mysten/sui.js/client";
import { WalletAccount } from "@wallet-standard/base";
import { useEffect, useState } from "react";
import { isMoveObject, isMoveStructArray, isMoveStructObject, VESTING_PACKAGE_ID } from "../utils";

export default function useGetVestingObject(account: WalletAccount, suiClient: SuiClient) {
  const [vestings, setVestings] = useState<any[]>([]);
  const vestings2: any[] = [];
  useEffect(() => {
    const init = async () => {
      const allVestingsResponse: PaginatedObjectsResponse = await suiClient.getOwnedObjects({
        owner: account.address,
        limit: 50,
        filter: {
          MatchAll: [
            {
              MoveModule: { package: `${VESTING_PACKAGE_ID}`, module: "vesting_contract" },
            },
          ],
        },
        options: {
          showContent: true,
        },
      });

      // eslint-disable-next-line array-callback-return
      allVestingsResponse.data.map((vesting: SuiObjectResponse) => {
        if (
          vesting.data &&
          vesting.data.content &&
          isMoveObject(vesting.data.content) &&
          !isMoveStructArray(vesting.data.content.fields) &&
          !isMoveStructObject(vesting.data.content.fields)
        ) {
          const fields = vesting.data.content.fields;

          if (fields.items !== null && !isMoveStructArray(fields) && !isMoveStructObject(fields)) {
            // setVestings((vestings) => [...vestings, vesting.data]);
            const datam = vesting.data;
            console.log(datam);

            vestings2.push(datam);
            console.log(vestings);
            // return {
            //   data: vesting.data,
            // };
          } else {
            return null;
          }
        }
      });

      setVestings(vestings2);
      // console.log(vestings);

      // a.forEach((b: any) => setVestings([...vestings, b.data]));

      // setVestings(a);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suiClient, account]);

  return { vestings };
}
