import { Keypair } from "@mysten/sui.js/cryptography";
import { StreamflowSui } from "@streamflow/stream";
import { IRecipient } from "@streamflow/stream/dist/common/types";
import { WalletContextState } from "@suiet/wallet-kit";

const suiClient = new StreamflowSui.SuiStreamClient("https://fullnode.testnet.sui.io:443");

export type VestParams = {
  startDate: number;
  period: number;
  cliff?: number;
  automaticWithdrawal: boolean;
};

export const vestMulti = async (wallet: WalletContextState | Keypair, mint: string, vestParams: VestParams, recipients: IRecipient[]) => {
  const createMultiStreamsParams = {
    tokenId: mint, // SPL token mint or Aptos Coin type
    cliff: vestParams.cliff || 0, // Vesting contract "cliff" timestamp in seconds.
    period: vestParams.period, // Time step (period) in seconds per which the unlocking occurs.
    start: vestParams.startDate, // Timestamp (in seconds) when the stream/token vesting starts.
    canTopup: false, // setting to FALSE will effectively create a vesting contract.
    cancelableBySender: false, // Wether or not sender can cancel the stream.
    cancelableByRecipient: false, // Wether or not recipient can cancel the stream.
    transferableBySender: false, // Wether or not sender can transfer the stream.
    transferableByRecipient: false, // Wether or not recipient can transfer the stream.
    automaticWithdrawal: vestParams.automaticWithdrawal, // [optional] Wether or not a 3rd party (e.g. cron job, "cranker") can initiate a token withdraw/transfer.
    withdrawalFrequency: vestParams.period, // [optional] Relevant when automatic withdrawal is enabled. If greater than 0 our withdrawor will take care of withdrawals. If equal to 0 our withdrawor will skip, but everyone else can initiate withdrawals.
    recipients,
  };

  const suiParams = {
    senderWallet: wallet, // WalletContextState | Keypair
  };

  try {
    const { txs, metadatas } = await suiClient.createMultiple(createMultiStreamsParams, suiParams as any);

    return { txs, metadatas };
  } catch (exception) {
    // handle exception
  }
};
