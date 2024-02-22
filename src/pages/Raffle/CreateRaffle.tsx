import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { CoinBalance, CoinMetadata, CoinSupply, PaginatedCoins, SuiClient } from "@mysten/sui.js/client";
import { useOutletContext } from "react-router-dom";
import useGetObjects from "../../hooks/useGetObjects";
import { PACKAGE_ID, RAFFLES, getCoin, getCoins } from "../../utils";
import { Select } from "../../components/Select";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { RaffleFormData } from "../../utils/types";
import { Loader } from "../../components/Loader";
import { PERIOD } from "../../utils/enum";

const CreateRaffle = () => {
  const account = useCurrentAccount();
  const [suiClient] = useOutletContext<[suiClient: SuiClient]>();

  const unitOfTime: { key: string; value: number }[] = Array.from({ length: 60 }, (_, value: number) => {
    return {
      key: (value + 1).toString(),
      value: value + 1,
    };
  });
  const [durationList, setDurationList] = useState<{ key: string; value: number }[]>([]);

  useEffect(() => {
    const durationArray: string[] = Object.keys(PERIOD).filter((key) => isNaN(Number(key)));
    const duration: { key: string; value: number }[] = durationArray.map((period: any) => {
      return {
        key: period,
        value: Number(PERIOD[period]),
      };
    });
    setDurationList(duration);
  }, []);

  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  const { coins, objectLoading } = useGetObjects(account!);

  const [raffleFormData, setRaffleFormData] = useState<RaffleFormData>({
    token: "",
    name: "",
    lockPeriod: {
      period: PERIOD["Minute"],
      unit: 1,
    },
    ticketPrice: 0,
    balance: 0,
  });

  const [selectedToken, setSelectedToken] = useState<{
    detail: {
      metadata: CoinMetadata | null;
      supply: CoinSupply;
    };
    coins: PaginatedCoins;
  }>();

  const [coinsData, setCoinsData] = useState<((CoinMetadata & { hex: string }) | null)[]>([]);

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

        // console.log(finalResult);
      }
    };

    init();
  }, [coins]);

  const create_counter = async () => {
    try {
      const tx = new TransactionBlock();

      const [counterNft] = tx.moveCall({
        target: `${PACKAGE_ID}::counter_nft::mint`,
      });

      tx.moveCall({
        target: `${PACKAGE_ID}::counter_nft::transfer_to_sender`,
        arguments: [counterNft],
      });

      signAndExecute(
        {
          transactionBlock: tx,
          account: account!,
        },
        {
          onSuccess: (tx: any) => {
            suiClient
              .waitForTransactionBlock({
                digest: tx.digest,
              })
              .then(() => {
                // navigate(ROUTES.NFT_LIST);
              });
          },
          onError: (error: any) => {
            console.log(error);
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const create_raffle = async () => {
    try {
      if (selectedToken) {
        const tx = new TransactionBlock();

        const primaryObject = selectedToken.coins.data[0].coinObjectId;
        const primaryBalance = selectedToken.coins.data[0].balance;

        if (Number(primaryBalance) < raffleFormData.balance) {
          tx.mergeCoins(
            tx.object(primaryObject),
            selectedToken.coins.data.slice(1)?.map((co) => tx.object(co.coinObjectId))
          );
        }

        const splitCoin = tx.splitCoins(primaryObject, [tx.pure(raffleFormData.balance * Math.pow(10, selectedToken?.detail.metadata?.decimals!))]);
        const period = raffleFormData.lockPeriod.period * raffleFormData.lockPeriod.unit;

        tx.moveCall({
          typeArguments: [raffleFormData.token],
          target: `${PACKAGE_ID}::coin_raffle::create_raffle`,
          arguments: [
            tx.pure(RAFFLES),
            tx.pure(raffleFormData.name),
            tx.pure(raffleFormData.ticketPrice),
            tx.pure(period),
            splitCoin,
            tx.object("0x807b486efe5a7cc2004df150824ea3492ce23014e253ea7496083b1dbb386da3"),
            tx.pure("0x6"),
          ],
        });

        signAndExecute(
          {
            transactionBlock: tx,
            account: account!,
          },
          {
            onSuccess: (tx: any) => {
              suiClient
                .waitForTransactionBlock({
                  digest: tx.digest,
                })
                .then((data: any) => {
                  console.log(data);
                  window.location.reload();
                });
            },
            onError: (error: any) => {
              console.log(error);
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useMemo(async () => {
    if (raffleFormData.token) {
      const selectedCoinDetail = await getCoin(suiClient, raffleFormData.token);
      const selectedCoinsPaginatedCoins = await suiClient.getCoins({ owner: account!.address, coinType: raffleFormData.token });
      setSelectedToken({ detail: selectedCoinDetail, coins: selectedCoinsPaginatedCoins });
    }
  }, [raffleFormData.token]);

  const disable = useMemo(() => {
    if (!selectedToken) {
      return true;
    } else {
      const totalBalance = Number(selectedToken?.detail.supply.value) / Math.pow(10, Number(selectedToken?.detail.metadata?.decimals));
      return (
        raffleFormData.balance > totalBalance || !raffleFormData.name || raffleFormData.lockPeriod.period <= 0 || raffleFormData.lockPeriod.unit <= 0 || !raffleFormData.ticketPrice
      );
    }
  }, [raffleFormData, selectedToken]);

  if (objectLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center my-12">
      <div>
        <p className="page-title">Create Raffle</p>
      </div>
      <div className="flex flex-col w-96 gap-8">
        <Select
          title="Tokens"
          options={coinsData.map((co) => {
            return { key: co?.name! + " (" + co?.symbol + ")", value: co?.hex! };
          })}
          onSelect={(value) => {
            setRaffleFormData({ ...raffleFormData, token: value });
          }}
          selectedOption={raffleFormData.token}
          placeholder="Select token for Raffle"
        />
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>) => setRaffleFormData({ ...raffleFormData, name: event.target.value })}
          placeholder="Raffle Name"
          title="Raffle Name"
          type="text"
          key={"raffleName"}
          value={raffleFormData.name}
          isRequired={true}
          disable={false}
        ></Input>
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>) => setRaffleFormData({ ...raffleFormData, ticketPrice: Number(event.target.value) })}
          placeholder="Ticket Price"
          title="Ticket Price"
          type="text"
          key={"ticketPrice"}
          isRequired={true}
          value={raffleFormData.ticketPrice}
          disable={false}
        ></Input>
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>) => setRaffleFormData({ ...raffleFormData, balance: Number(event.target.value) })}
          placeholder="Raffle Price"
          title="Raffle Price"
          type="text"
          key={"raffleBalance"}
          isRequired={true}
          value={raffleFormData.balance}
          disable={false}
        ></Input>
        <div className="flex justify-center">
          <div className="w-1/2 mr-1">
            <Select
              placeholder="Select unit time"
              onSelect={(value: any) => {
                setRaffleFormData({
                  ...raffleFormData,
                  lockPeriod: {
                    ...raffleFormData.lockPeriod,
                    unit: Number(value),
                  },
                });
              }}
              options={unitOfTime}
              selectedOption={raffleFormData.lockPeriod.unit}
              title="Unit"
            ></Select>
          </div>
          <div className="w-1/2 ml-1">
            <Select
              placeholder="Select period"
              onSelect={(value: any) => {
                setRaffleFormData({
                  ...raffleFormData,
                  lockPeriod: {
                    ...raffleFormData.lockPeriod,
                    period: Number(value),
                  },
                });
              }}
              options={durationList}
              selectedOption={raffleFormData.lockPeriod.period}
              title="Period"
            ></Select>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-2/5">
            <Button disabled={disable} onClick={create_raffle} title="Create Raffle"></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRaffle;
