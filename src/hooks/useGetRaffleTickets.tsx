import { PaginatedObjectsResponse, SuiClient, SuiObjectResponse } from "@mysten/sui.js/client";
import { WalletAccount } from "@wallet-standard/base";
import { useEffect, useState } from "react";
import { RaffleTicketObject, RaffleTicketObjectFields } from "../utils/types";
import { PACKAGE_ID, isMoveObject, isMoveStructArray, isMoveStructObject } from "../utils";

export default function useGetRaffleTickets(account: WalletAccount, suiClient: SuiClient) {
  const [tickets, setTickets] = useState<RaffleTicketObject[]>([]);
  const [loadingTickets, setLoadingTickets] = useState<Boolean>(true);

  useEffect(() => {
    const init = async () => {
      const allTicketsResponse: PaginatedObjectsResponse = await suiClient.getOwnedObjects({
        owner: account.address,
        limit: 50,
        filter: {
          MatchAll: [
            {
              MoveModule: { package: `${PACKAGE_ID}`, module: "coin_raffle" },
            },
          ],
        },
        options: {
          showContent: true,
        },
      });
      allTicketsResponse.data.map((ticket: SuiObjectResponse) => {
        if (
          ticket.data &&
          ticket.data.content &&
          isMoveObject(ticket.data.content) &&
          !isMoveStructArray(ticket.data.content.fields) &&
          !isMoveStructObject(ticket.data.content.fields)
        ) {
          let mainField: RaffleTicketObjectFields;

          mainField = {
            id: { id: `${ticket.data.content.fields.id}` },
            raffle_id: `${ticket.data.content.fields.raffle_id}`,
            ticket_no: `${ticket.data.content.fields.ticket_no}`,
          };
          const ticketData: RaffleTicketObject = {
            content: {
              dataType: ticket.data.content.dataType,
              fields: {
                id: mainField.id,
                raffle_id: mainField.raffle_id,
                ticket_no: mainField.ticket_no,
              },
              hasPublicTransfer: ticket.data.content.hasPublicTransfer,
              type: ticket.data.content.type,
            },
            digest: ticket.data?.digest,
            objectId: ticket.data?.objectId,
            version: ticket.data?.version,
          };
          setTickets((tickets) => [...tickets, ticketData]);
        }
      });
      setLoadingTickets(false);
    };
    init();
  }, []);

  return { tickets, loadingTickets };
}
