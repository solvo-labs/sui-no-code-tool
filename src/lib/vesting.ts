import { Keypair } from "@mysten/sui.js/cryptography";
// @ts-ignore
import { GenericStreamClient, Types, StreamflowSui, StreamType } from "@streamflow/stream";
// @ts-ignore
import { IRecipient } from "@streamflow/stream/dist/common/types";
// import { WalletContextState } from "@suiet/wallet-kit";
import { VestingForm } from "../utils/types";
import { WalletAccount } from "@wallet-standard/base";

const suiClient = new StreamflowSui.SuiStreamClient("https://fullnode.devnet.sui.io:443");

export const vestMulti = async (wallet: WalletAccount | Keypair, vestParams: VestingForm, recipients: IRecipient[]) => {
  const createMultiStreamsParams = {
    tokenId: vestParams.token!.hex, // SPL token mint or Aptos Coin type
    cliff: vestParams.activeCliff ? vestParams.cliffTime : 0, // Vesting contract "cliff" timestamp in seconds.
    period: vestParams.durationTime.unit * vestParams.durationTime.period, // Time step (period) in seconds per which the unlocking occurs.
    start: vestParams.startDate, // Timestamp (in seconds) when the stream/token vesting starts.
    canTopup: false, // setting to FALSE will effectively create a vesting contract.
    cancelableBySender: false, // Wether or not sender can cancel the stream.
    cancelableByRecipient: false, // Wether or not recipient can cancel the stream.
    transferableBySender: false, // Wether or not sender can transfer the stream.
    transferableByRecipient: false, // Wether or not recipient can transfer the stream.
    automaticWithdrawal: vestParams.autoWithdraw, // [optional] Wether or not a 3rd party (e.g. cron job, "cranker") can initiate a token withdraw/transfer.
    withdrawalFrequency: vestParams.scheduleTime, // [optional] Relevant when automatic withdrawal is enabled. If greater than 0 our withdrawor will take care of withdrawals. If equal to 0 our withdrawor will skip, but everyone else can initiate withdrawals.
    recipients,
  };

  const suiParams = {
    senderWallet: wallet, // WalletContextState | Keypair
  };

  try {
    const { txs, metadatas } = await suiClient.createMultiple(createMultiStreamsParams, suiParams as any);

    return { txs, metadatas };
  } catch (error) {
    console.log(error);
    // handle exception
  }
};
