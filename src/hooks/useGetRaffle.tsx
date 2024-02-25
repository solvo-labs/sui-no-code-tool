import { DevInspectResults, MoveValue, SuiClient, SuiExecutionResult, SuiObjectResponse } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { PACKAGE_ID, RAFFLES, isMoveObject, isMoveStructArray, isMoveStructObject, isStringArray, isStringId } from "../utils";
import { WalletAccount } from "@wallet-standard/base";
import { useEffect, useState } from "react";
import { BCS, getSuiMoveConfig } from "@mysten/bcs";
import { RaffleObject, RaffleObjectFields } from "../utils/types";

export default function useGetRaffle(account: WalletAccount, suiClient: SuiClient) {
  const [raffles, setRaffles] = useState<RaffleObject[]>([]);
  const [loadingRaffle, setLoadingRaffle] = useState<Boolean>(true);

  // ref ->https://github.com/juzybits/polymedia-profile/blob/a701cae44d033cbafd657d5e8fb5b2563f97382a/sdk/src/profile.ts#L351
  useEffect(() => {
    const getRaffles = async () => {
      const tx = new TransactionBlock();

      // enter custom raffles
      tx.moveCall({
        target: `${PACKAGE_ID}::coin_raffle::get_raffles`,
        arguments: [tx.object(RAFFLES)],
      });

      const response: DevInspectResults = await suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: account.address,
      });

      response.results?.map(async (value: SuiExecutionResult) => {
        if (value.returnValues) {
          const indexZero = value.returnValues[0];

          const valueType = indexZero[1];
          const valueData = Uint8Array.from(indexZero[0]);

          const bcs = new BCS(getSuiMoveConfig());
          const raffleObjects = bcs.de(valueType, valueData, "hex");

          const multiObjects: SuiObjectResponse[] = await getMultiObjects(raffleObjects);

          multiObjects.map((object: SuiObjectResponse) => {
            if (
              object.data &&
              object.data.content &&
              isMoveObject(object.data.content) &&
              !isMoveStructObject(object.data.content.fields) &&
              !isMoveStructArray(object.data.content.fields)
            ) {
              const data = object.data;
              const content = object.data.content;
              const fields = object.data.content.fields;

              let mainField: RaffleObjectFields;
              let claimed: boolean;
              let id: { id: string } = { id: "" };
              let winner: string;
              let participants: Array<string>;

              fields.claimed !== null && typeof fields.claimed === "boolean" ? (claimed = fields.claimed) : (claimed = false);
              isStringId(fields.id) ? (id = fields.id) : { id: "" };
              fields.winner !== null && typeof fields.winner === "string" ? (winner = fields.winner) : (winner = "");
              // isStringArray(fields.participants) ? (participants = fields.participands as any) : (participants = null);

              if (isStringArray(fields.participants)) {
                participants = fields.participants;
              } else {
                participants = [];
              }

              mainField = {
                balance: `${fields.balance}`,
                claimed: claimed,
                end_time: `${fields.end_time}`,
                id: id,
                name: `${fields.name}`,
                owner: `${fields.owner}`,
                participants: participants,
                reward: `${fields.reward}`,
                ticket_count: `${fields.ticket_count}`,
                ticket_price: `${fields.ticket_price}`,
                vrf_input: fields.vrf_input,
                winner: winner,
              };

              const raffleData: RaffleObject = {
                data: {
                  content: {
                    dataType: content.dataType,
                    fields: {
                      balance: mainField.balance,
                      claimed: mainField.claimed,
                      end_time: mainField.end_time,
                      id: mainField.id,
                      name: mainField.name,
                      owner: mainField.owner,
                      participants: mainField.participants,
                      reward: mainField.reward,
                      ticket_count: mainField.ticket_count,
                      ticket_price: mainField.ticket_price,
                      vrf_input: mainField.vrf_input,
                      winner: mainField.winner,
                    },
                    hasPublicTransfer: content.hasPublicTransfer,
                    type: content.type,
                  },
                  digest: data.digest,
                  objectId: data.objectId,
                  version: data.version,
                },
              };
              setRaffles(() => [...raffles, raffleData]);
            }
          });
          setLoadingRaffle(false);
        }
      });
    };

    getRaffles();
  }, []);

  const getMultiObjects = async (objectIds: string[]): Promise<SuiObjectResponse[]> => {
    try {
      const result = await suiClient.multiGetObjects({
        ids: objectIds,
        options: { showContent: true },
      });

      return result;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  return { raffles, loadingRaffle };
}
