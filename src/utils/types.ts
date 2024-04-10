import { CoinMetadata, CoinSupply, MoveValue } from "@mysten/sui.js/client";
import BN from "bn.js";

export type TokenForm = {
  name: string;
  symbol: string;
  decimal: number;
  asset: string;
  description: string;
};

export type CoinDetail = {
  metadata: CoinMetadata;
  supply: CoinSupply;
  content: {
    dataType: string;
    hasPublicTransfer: boolean;
  };
  digest: string;
  objectId: string;
  type: string;
  version: string;
  owmer: string;
};

export type NftForm = {
  name: string;
  description: string;
  asset: string;
};

export type NftObject = {
  data: {
    content: {
      dataType: string;
      fields: {
        name: string;
        url: string;
        description: string;
      };
      hasPublicTransfer: boolean;
    };
    objectId: string;
    owner: string;
    previousTransaction: string;
    storageRebate: string;
    type: string;
    version: string;
  };
};

export type TransferForm = {
  recipient: string;
  balance: number;
};

export type NftCollection = {
  packageId: string;
  collectionName: string;
};

export type RaffleFormData = {
  token: string;
  name: string;
  ticketPrice: string;
  lockPeriod: {
    unit: number;
    period: number;
  };
  reward: number;
};

export type RaffleObject = {
  data: {
    content: {
      dataType: "moveObject";
      fields: RaffleObjectFields;
      hasPublicTransfer: boolean;
      type: string;
    };
    digest: string;
    objectId: string;
    version: string;
    won?: boolean;
    winnerTicketId?: string | undefined;
  };
};

export type RaffleObjectFields = {
  balance: string;
  claimed: boolean;
  end_time: string;
  id: { id: string };
  name: string;
  owner: string;
  participants: Array<string> | [];
  reward: string;
  ticket_count: string;
  ticket_price: string;
  vrf_input: MoveValue;
  winner: string;
};

export type RaffleTicketObject = {
  content: {
    dataType: "moveObject";
    fields: RaffleTicketObjectFields;
    hasPublicTransfer: boolean;
    type: string;
  };
  digest: string;
  objectId: string;
  version: string;
};

export type RaffleTicketObjectFields = {
  id: {
    id: string;
  };
  raffle_id: string;
  ticket_no: string;
};

export type ParticipantForm = {
  selected_token: string;
  wallet_address: string;
  start_date: number;
  end_date: number;
  cliff_time: number;
  durationTime: {
    unit: number;
    period: number;
  };
  balance: number;
};

export type VestingForm = {
  token: (CoinMetadata & { hex: string }) | undefined;
  startDate: number;
  durationTime: {
    unit: number;
    period: number;
  };
  scheduleTime: number;
  autoWithdraw: boolean;
  activeCliff: boolean;
  cliffAmount?: number;
  cliffTime: number;
  // recipients: RecipientForm[];
};

export type Recipient = {
  recipient: string;
  amount: BN;
  name: string;
  cliffAmount: BN;
  amountPerPeriod: BN;
};

export type VestingMetadata = {
  content: {
    dataType: "moveObject";
    fields: VestingObjectFields;
    hasPublicTransfer: boolean;
    type: string;
  };
  digest: string;
  objectId: string;
  version: string;
};

export type VestingObjectFields = {
  id: { id: string };
  items: {
    fields: { id: { id: string }; size: string };
    type: string;
  };
  name: string;
};
