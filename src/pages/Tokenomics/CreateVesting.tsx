import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChangeEvent, useMemo, useState } from "react";
import { VESTING_PACKAGE_ID } from "../../utils";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { ROUTES } from "../../utils/enum";
import { TransactionBlock } from "@mysten/sui.js/transactions";

const CreateVesting = () => {
  const account = useCurrentAccount();
  const [suiClient] = useOutletContext<[suiClient: any]>();
  const [vestingName, setVestingName] = useState<string>("");
  const navigate = useNavigate();

  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  // const { coins, objectLoading } = useGetObjects(account!);

  // const [coinsData, setCoinsData] = useState<((CoinMetadata & { hex: string }) | null)[]>([]);
  // const [recipientModal, setRecipientModal] = useState<boolean>(false);

  // const [recipient, setRecipient] = useState<RecipientForm>({
  //   amount: "",
  //   walletAddress: "",
  // });

  // const [vestingFormData, setVestingFormData] = useState<VestingForm>({
  //   activeCliff: false,
  //   autoWithdraw: false,
  //   cliffAmount: 0,
  //   cliffTime: moment().unix() * 1000,
  //   durationTime: {
  //     period: 0,
  //     unit: 0,
  //   },
  //   recipients: [],
  //   scheduleTime: 0,
  //   startDate: moment().unix() * 1000,
  //   token: undefined,
  // });

  // const [durationList, setDurationList] = useState<Option[]>([]);
  // const [scheduleList, setScheduleList] = useState<Option[]>([]);

  // const addRecipient = () => {
  //   const recipientData = recipient;
  //   setVestingFormData((vestingFormData) => ({
  //     ...vestingFormData,
  //     recipients: [...vestingFormData.recipients, recipientData],
  //   }));
  //   setRecipient({
  //     amount: "",
  //     walletAddress: "",
  //     name: "",
  //   });
  // };

  // const removeRecipient = (recipient: RecipientForm) => {
  //   setVestingFormData((vestingFormData) => ({
  //     ...vestingFormData,
  //     recipients: vestingFormData.recipients.filter((item) => item !== recipient),
  //   }));
  // };

  // useEffect(() => {
  //   const durationArray: string[] = Object.keys(PERIOD).filter((key) => isNaN(Number(key)));
  //   const duration: { key: string; value: number }[] = durationArray.map((period: any) => {
  //     return {
  //       key: period,
  //       value: Number(PERIOD[period]),
  //     };
  //   });

  //   const scheduleArray: string[] = Object.keys(SCHEDULE).filter((key) => isNaN(Number(key)));
  //   const schedule: { key: string; value: number }[] = scheduleArray.map((period: any) => {
  //     return {
  //       key: period,
  //       value: Number(SCHEDULE[period]),
  //     };
  //   });

  //   setScheduleList(schedule);

  //   setDurationList(duration);
  // }, []);

  // const disableAddRecipient = useMemo(() => {
  //   return !recipient.amount || !recipient.walletAddress;
  // }, [recipient]);

  const disable = useMemo(() => {
    return !vestingName;
    // return (
    //   !vestingFormData.token ||
    //   vestingFormData.startDate <= moment().unix() * 1000 ||
    //   !vestingFormData.durationTime.unit ||
    //   !vestingFormData.durationTime.period ||
    //   !vestingFormData.scheduleTime
    // );
  }, [vestingName]);

  // useEffect(() => {
  //   const init = async () => {
  //     const { coinList } = await getCoins(suiClient, coins || []);

  //     if (coins) {
  //       const balancesPromise = coins!.map(async (coin: any) => {
  //         const currentBalanceData: CoinBalance = await suiClient.getBalance({
  //           owner: account?.address!,
  //           coinType: coin,
  //         });

  //         return currentBalanceData;
  //       });

  //       const balances = await Promise.all(balancesPromise);

  //       const result = coinList.map((coinD: any, index: number) => {
  //         return {
  //           ...coinD,
  //           total_balance: balances[index].totalBalance,
  //         };
  //       });

  //       const finalResult = result.filter((coin: any) => coin.total_balance > 0);
  //       setCoinsData(finalResult);
  //     }
  //   };

  //   init();
  // }, []);

  const create_vesting = async () => {
    if (account) {
      try {
        const tx = new TransactionBlock();

        const [vestingRecord] = tx.moveCall({
          target: `${VESTING_PACKAGE_ID}::vesting_contract::init_vesting`,
          arguments: [tx.pure(vestingName)],
        });

        tx.moveCall({
          target: `${VESTING_PACKAGE_ID}::vesting_contract::transfer_vesting_record`,
          arguments: [vestingRecord],
        });

        signAndExecute(
          {
            transactionBlock: tx as any,
            account: account,
          },
          {
            onSuccess: (tx: any) => {
              suiClient
                .waitForTransactionBlock({
                  digest: tx.digest,
                })
                .then(() => {
                  navigate(ROUTES.TOKENOMICS_MANAGE);
                });
            },
            onError: (error: any) => {
              console.log(error);
            },
          }
        );
      } catch (error) {}
    }

    // if (account && vestingFormData.recipients.length > 0) {
    // const amountPer = (vestingFormData.durationTime.period * vestingFormData.durationTime.unit) / vestingFormData.scheduleTime;
    // const recipientList: Recipient[] = vestingFormData.recipients.map((recipient: RecipientForm) => {
    //   return {
    //     recipient: recipient.walletAddress,
    //     amount: getBN(Number(recipient.amount), 8),
    //     name: recipient.name || "",
    //     cliffAmount: getBN(vestingFormData.cliffAmount || 0, vestingFormData.token!.decimals),
    //     amountPerPeriod: getBN(Number(recipient.amount) / amountPer, vestingFormData.token!.decimals),
    //   };
    // });
    // const data = await vestMulti(account!, vestingFormData, recipientList);
    // const data = await vestSingle(account!, vestingFormData, recipientList[0]);
    // }
  };

  // if (objectLoading) {
  //   return <Loader />;
  // }

  return (
    <div className="flex flex-col items-center my-12">
      <div>
        <p className="page-title">Create Tokenomics</p>
      </div>
      <div className="flex flex-col w-96 gap-8">
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>) => setVestingName(event.target.value)}
          placeholder="Vesting Round Name"
          type="text"
          value={vestingName}
          title="Vesting Round Name"
        ></Input>
        {/* <Select
          title="Tokens"
          options={coinsData.map((co) => {
            return { key: co?.name! + " (" + co?.symbol + ")", value: co?.hex! };
          })}
          onSelect={(value) => {
            const selectedCoin = coinsData.find((coin: (CoinMetadata & { hex: string }) | null) => coin!.hex === value);
            setVestingFormData({ ...vestingFormData, token: selectedCoin! });
          }}
          selectedOption={vestingFormData.token ? vestingFormData.token.hex : undefined}
          placeholder="Select token for Vesting"
        />
        <TimeSelector
          title="Select Start Time"
          date={vestingFormData.startDate}
          handleDate={(e: ChangeEvent<HTMLInputElement>) => {
            const date = new Date(e.target.value);
            const timestamp = moment(date).valueOf();
            setVestingFormData({ ...vestingFormData, startDate: timestamp });
          }}
          handleTime={(e: ChangeEvent<HTMLInputElement>) => {
            const vestingTime = moment(vestingFormData.startDate).format(`ddd MMM DD YYYY ${e.target.value}:00 [GMT]ZZ`);
            const timestamp = moment(vestingTime).valueOf();
            setVestingFormData({ ...vestingFormData, startDate: timestamp });
          }}
        ></TimeSelector>
        <div className="flex">
          <div className="w-2/5 pr-1">
            <Input
              onChange={(e) =>
                setVestingFormData({
                  ...vestingFormData,
                  durationTime: {
                    ...vestingFormData.durationTime,
                    unit: Number(e.target.value),
                  },
                })
              }
              placeholder="Unit"
              type="text"
              value={vestingFormData.durationTime.unit.toString()}
              title="Unit"
            ></Input>
          </div>
          <div className="w-3/5 pl-1">
            <Select
              title="Duration"
              options={durationList}
              onSelect={(value) =>
                setVestingFormData({
                  ...vestingFormData,
                  durationTime: {
                    ...vestingFormData.durationTime,
                    period: Number(value),
                  },
                })
              }
              selectedOption={vestingFormData.durationTime.period}
              placeholder="Select duration"
            ></Select>
          </div>
        </div>
        <Select
          title="Unlock Schedule"
          options={scheduleList}
          onSelect={(value) =>
            setVestingFormData({
              ...vestingFormData,
              scheduleTime: Number(value),
            })
          }
          selectedOption={vestingFormData.scheduleTime}
          placeholder="Unlock Schedule"
        ></Select>
        <Checkbox
          checked={vestingFormData.autoWithdraw}
          onChange={() =>
            setVestingFormData({
              ...vestingFormData,
              autoWithdraw: !vestingFormData.autoWithdraw,
            })
          }
          text="Automatic Withdraw"
        ></Checkbox>
        <Checkbox
          checked={vestingFormData.activeCliff}
          onChange={() =>
            setVestingFormData({
              ...vestingFormData,
              activeCliff: !vestingFormData.activeCliff,
            })
          }
          text="Activate Cliff"
        ></Checkbox>
        {vestingFormData.activeCliff && (
          <>
            <Input
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setVestingFormData({
                  ...vestingFormData,
                  cliffAmount: Number(e.target.value),
                })
              }
              placeholder="Cliff Amount"
              title="Cliff Amount"
              type="text"
              value={vestingFormData.cliffAmount ? vestingFormData.cliffAmount : "0"}
              disable={false}
              isRequired={false}
            ></Input>
            <TimeSelector
              title="Select Cliff Time"
              date={vestingFormData.cliffTime}
              handleDate={(e: ChangeEvent<HTMLInputElement>) => {
                const date = new Date(e.target.value);
                const timestamp = moment(date).valueOf();
                setVestingFormData({ ...vestingFormData, cliffTime: timestamp });
              }}
              handleTime={(e: ChangeEvent<HTMLInputElement>) => {
                const vestingTime = moment(vestingFormData.startDate).format(`ddd MMM DD YYYY ${e.target.value}:00 [GMT]ZZ`);
                const timestamp = moment(vestingTime).valueOf();
                setVestingFormData({ ...vestingFormData, cliffTime: timestamp });
              }}
            ></TimeSelector>
          </>
        )} */}
        {/* <div className="flex justify-center">
          <div className="w-max">
            <Button
              onClick={() => setRecipientModal(true)}
              title="Add recipient"
              textSize="sm"
              leftImage={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                  />
                </svg>
              }
            ></Button>
            <AddRecipientModal
              handleClose={() => setRecipientModal(false)}
              open={recipientModal}
              recipientList={vestingFormData.recipients}
              recipient={recipient!}
              handleRecipient={setRecipient}
              handleRecipients={addRecipient}
              disable={disableAddRecipient}
              handleRemoveRecipient={removeRecipient}
            ></AddRecipientModal>
          </div>
        </div> */}

        <div className="flex justify-center">
          <div className="w-max">
            <Button disabled={disable} onClick={create_vesting} textSize="base" title="Create Vesting Contract"></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVesting;
