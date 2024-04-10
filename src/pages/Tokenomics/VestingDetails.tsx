import { useEffect, useMemo, useState } from "react";
import { ParticipantForm } from "../../utils/types";
import ParticipantsCard from "../../components/vesting/ParticipantsCard";
import AddParticipantsModal from "../../components/vesting/AddParticipantsModal";
import { getCoin, getCoins, VESTING_PACKAGE_ID } from "../../utils";
import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { useOutletContext } from "react-router-dom";
import useGetObjects from "../../hooks/useGetObjects";
import { CoinBalance, CoinMetadata, CoinSupply, PaginatedCoins } from "@mysten/sui.js/client";
import moment from "moment";
import { TransactionBlock } from "@mysten/sui.js/transactions";

const VestingDetails = () => {
  const account = useCurrentAccount();
  const [suiClient] = useOutletContext<[suiClient: any]>();
  const { coins } = useGetObjects(account!);
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  const [coinsData, setCoinsData] = useState<(CoinMetadata & { hex: string })[]>([]);

  const [selectedToken, setSelectedToken] = useState<{
    detail: {
      metadata: CoinMetadata | null;
      supply: CoinSupply;
    };
    coins: PaginatedCoins;
  }>();

  const [recipientModal, setRecipientModal] = useState<boolean>(false);

  const [participant, setParticipant] = useState<ParticipantForm>({
    selected_token: "",
    balance: 0,
    cliff_time: 0,
    durationTime: {
      period: 0,
      unit: 0,
    },
    end_date: 0,
    start_date: 0,
    wallet_address: "",
  });

  const [participants, setParticipants] = useState<ParticipantForm[]>([]);

  // const handleOpen = (setState: any) => setState(true);

  // const handleClose = (setState: any) => setState(false);

  const addParticipant = () => {
    setParticipants((participants) => [...participants, participant]);
    setParticipant({
      selected_token: "",
      balance: 0,
      cliff_time: 0,
      durationTime: {
        period: 0,
        unit: 0,
      },
      end_date: 0,
      start_date: 0,
      wallet_address: "",
    });
  };

  const disableAddParticipant = useMemo(() => {
    return (
      !participant.selected_token ||
      !participant.wallet_address ||
      participant.balance <= 0 ||
      participant.durationTime.unit <= 0 ||
      participant.durationTime.period <= 0 ||
      participant.start_date <= moment().unix() * 1000 ||
      participant.end_date <= moment().unix() * 1000 ||
      participant.cliff_time <= moment().unix() * 1000
    );
  }, [participant]);

  const removeRecipient = (participant: ParticipantForm) => {
    setParticipants((participants) => participants.filter((item) => item !== participant));
    // setParticipants()
    // setVestingFormData((vestingFormData) => ({
    //   ...vestingFormData,
    //   recipients: vestingFormData.recipients.filter((item) => item !== recipient),
    // }));
  };

  // useEffect(() => {
  //   const init = () => {
  //     console.log(participants);
  //   };
  //   init();
  // }, [participants]);

  useEffect(() => {
    const init = async () => {
      const { coinList } = await getCoins(suiClient, coins || []);

      if (coins) {
        const balancesPromise = coins!.map(async (coin: any) => {
          const currentBalanceData: CoinBalance = await suiClient.getBalance({
            owner: account?.address!,
            coinType: coin,
          });

          return currentBalanceData;
        });

        const balances = await Promise.all(balancesPromise);

        const result = coinList.map((coinD: any, index: number) => {
          return {
            ...coinD,
            total_balance: balances[index].totalBalance,
          };
        });

        const finalResult = result.filter((coin: any) => coin.total_balance > 0);
        setCoinsData(finalResult);
      }
    };

    init();
  }, [coins, account, suiClient]);

  const create_vesting_participant = () => {
    try {
      if (selectedToken) {
        const tx = new TransactionBlock();
        const primaryObject = selectedToken.coins.data[0].coinObjectId;
        const primaryBalance = selectedToken.coins.data[0].balance;
        const balance = BigInt(participant.balance) * BigInt(Math.pow(10, selectedToken?.detail.metadata?.decimals!));

        if (Number(primaryBalance) < balance) {
          tx.mergeCoins(
            tx.object(primaryObject),
            selectedToken.coins.data.slice(1)?.map((co) => tx.object(co.coinObjectId))
          );
        }

        const splitCoin = tx.splitCoins(tx.object(primaryObject), [tx.pure(balance)]);

        tx.moveCall({
          typeArguments: [participant.selected_token],
          target: `${VESTING_PACKAGE_ID}::vesting_contract::create_vesting`,
          arguments: [
            tx.object("0x3943d2be8aeaccee06df381f242b8ea4f2935f4899c8635268c7b97fe886aaf1"),
            tx.pure(participant.start_date),
            tx.pure(participant.end_date),
            tx.pure(60000),
            tx.pure(participant.durationTime.period * participant.durationTime.unit),
            splitCoin,
            tx.pure(participant.wallet_address),
          ],
        });

        signAndExecute(
          {
            transactionBlock: tx as any,
            account: account!,
          },
          {
            onSuccess: (tx: any) => {
              suiClient
                .waitForTransactionBlock({
                  digest: tx.digest,
                })
                .then(() => {
                  window.location.reload();
                  // navigate(ROUTES.TOKENOMICS_MANAGE);
                });
            },
            onError: (error: any) => {
              console.log(error);
            },
          }
        );
      }
    } catch (error) {}
  };

  useMemo(async () => {
    if (participant.selected_token) {
      const selectedCoinDetail = await getCoin(suiClient, participant.selected_token);
      const selectedCoinsPaginatedCoins = await suiClient.getCoins({ owner: account!.address, coinType: participant.selected_token });
      setSelectedToken({ detail: selectedCoinDetail, coins: selectedCoinsPaginatedCoins });
    }
  }, [participant.selected_token, account, suiClient]);

  return (
    <div className="p-8 flex flex-col 2xl:w-4/5 xl:w-4/5 lg:w-4/5 md:w-11/12 sx:w-full gap-2">
      <div className="flex flex-row justify-between items-baseline">
        <h4 className="page-title">Vesting Program - 1</h4>
      </div>
      <div className="flex items-center">
        <div className="flex flex-col justify-center bg-gray-100 rounded-lg p-8 w-full">
          <div className="grid grid-row gap-8">
            <div className="flex flex-col justify-center">
              <p className="font-bold text-lg">Object ID</p>
              <p>0x4c46b21634c11f139fe04cc1698eea105f77ab69c11872d8efde7d6eb0b4925b</p>
            </div>
            <div className="flex flex-col justify-center">
              <p className="font-bold text-lg">Owner's Account</p>
              <p>0xc0080d8cbbe6e1b9b44652b4649762548d50a6f327a882f21bd47ef4c88d2c5d</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-xl flex flex-col p-8 divide-y divide-sui-blue-h">
        <div className="flex flex-row items-baseline justify-between">
          <h5 className="text-2xl font-bold">Participants List</h5>
          <div>
            <button className="hover:bg-h-gray" onClick={() => setRecipientModal(true)}>
              Add Participants
            </button>
            <AddParticipantsModal
              handleClose={() => setRecipientModal(false)}
              open={recipientModal}
              disable={disableAddParticipant}
              handleParticipant={setParticipant}
              handleParticipants={addParticipant}
              handleRemoveParticipant={removeRecipient}
              participant={participant}
              participants={participants}
              coins={coinsData ? coinsData : []}
              createVestingItems={create_vesting_participant}
            ></AddParticipantsModal>
          </div>
        </div>
        <div className="grid gap-4 mt-2 pt-8 2xl:grid-cols-3 xl:grid-cols-2 lg:gridcols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
          <ParticipantsCard></ParticipantsCard>
        </div>
      </div>
    </div>
  );
};

export default VestingDetails;
