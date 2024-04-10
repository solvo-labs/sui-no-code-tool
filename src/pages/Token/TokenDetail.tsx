import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { SuiClient } from "@mysten/sui.js/client";
import { useEffect, useMemo, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Loader } from "../../components/Loader";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import useGetCoinDetails from "../../hooks/useGetCoinDetails";
import { MdInsertPhoto } from "react-icons/md";
import TransferCoinModal from "../../components/TransferCoinModal";
import BurnCoinModal from "../../components/BurnCoinModal";
import { TransferForm } from "../../utils/types";
import { useGetTotalSupply } from "../../hooks/useGetTotalSupply";
import MintAndTransferModal from "../../components/MintAndTransferModal";

const TokenDetail = () => {
  const account = useCurrentAccount();
  const [suiClient] = useOutletContext<[suiClient: SuiClient]>();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  const { coin, coinObjects, coinDetailLoading } = useGetCoinDetails(account!, suiClient, id!);
  const { currentBalance } = useGetTotalSupply(suiClient, account!, id!);

  const [burnBalance, setBurnBalance] = useState<number>(0);
  const [mintAndTransferForm, setMintAndTransferForm] = useState<TransferForm & { checkbox: boolean }>({
    recipient: "",
    balance: 0,
    checkbox: false,
  });
  const [transferForm, setTransferForm] = useState<TransferForm>({
    recipient: "",
    balance: 0,
  });

  const [modals, setModals] = useState<{ transferModal: boolean; burnModal: boolean; mintAndTransferModal: boolean }>({
    transferModal: false,
    burnModal: false,
    mintAndTransferModal: false,
  });

  const handleOpen = (setState: any, modal: any) => {
    setState({
      ...modals,
      [modal]: true,
    });
  };

  const handleClose = (setState: any, modal: any) => {
    setState({
      ...modals,
      [modal]: false,
    });
  };

  useEffect(() => {
    const init = async () => {
      if (id && account) {
        // const treasuryObject = await suiClient.getOwnedObjects({
        //   owner: account.address,
        //   filter: {
        //     MatchAll: [
        //       {
        //         StructType: "0x2::coin::TreasuryCap<" + id + ">",
        //       },
        //     ],
        //   },
        //   options: {
        //     showContent: true,
        //     showType: true,
        //   },
        // });

        // const to = treasuryObject.data[0];

        // setTreasury(to);
        setLoading(false);
      } else {
        // @to-do add toastr
        console.log("ERROR", "Something went wrong");
      }
    };

    init();
  }, [account, id, suiClient]);

  const mintAndTransfer = async () => {
    try {
      if (account && id && coin) {
        const tx = new TransactionBlock();

        const tokenDecimal = coin.metadata?.decimals || 0;

        tx.moveCall({
          typeArguments: [id],
          target: `0x2::coin::mint_and_transfer`,
          arguments: [tx.pure(coin.objectId), tx.pure(mintAndTransferForm.balance * Math.pow(10, tokenDecimal)), tx.pure(mintAndTransferForm.recipient)],
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
    } catch (error) {}
  };

  const burn = async () => {
    try {
      if (account && id && coinObjects && coin) {
        const tx = new TransactionBlock();

        const tokenDecimal = coin?.metadata.decimals || 0;

        const primaryObject = coinObjects[0].coinObjectId;
        const primaryBalance = coinObjects[0].balance;

        if (Number(primaryBalance) < burnBalance) {
          tx.mergeCoins(
            tx.object(primaryObject),
            coinObjects.slice(1)?.map((co) => tx.object(co.coinObjectId))
          );
        }

        const splitCoin = tx.splitCoins(primaryObject, [tx.pure(burnBalance * Math.pow(10, tokenDecimal))]);

        tx.moveCall({
          typeArguments: [id],
          target: `0x2::coin::burn`,
          arguments: [tx.pure(coin.objectId), splitCoin],
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
    } catch (error) {}
  };

  const transfer = () => {
    try {
      if (account && coin && coinObjects) {
        const tx = new TransactionBlock();

        const tokenDecimal = coin?.metadata.decimals || 0;

        const primaryObject = coinObjects[0].coinObjectId;
        const primaryBalance = coinObjects[0].balance;

        if (Number(primaryBalance) < transferForm.balance) {
          tx.mergeCoins(
            tx.object(primaryObject),
            coinObjects.slice(1)?.map((co) => tx.object(co.coinObjectId))
          );
        }

        const splitCoin = tx.splitCoins(primaryObject, [tx.pure(transferForm.balance * Math.pow(10, tokenDecimal))]);
        tx.transferObjects([splitCoin], tx.pure(transferForm.recipient));

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
    } catch (error) {}
  };

  const transferDisable = useMemo(() => {
    return !transferForm.balance || !transferForm.recipient;
  }, [transferForm]);

  const mintAndTransferDisable = useMemo(() => {
    return !mintAndTransferForm.balance || !mintAndTransferForm.recipient;
  }, [mintAndTransferForm]);

  if (loading || coinDetailLoading) {
    return <Loader />;
  }

  return (
    <div className="p-8 flex flex-col 2xl:w-10/12 xl:w-10/12 gap-4 h-max">
      <div className="bg-gray-100 p-4 flex flex-row items-center rounded-lg">
        {coin?.metadata.iconUrl ? (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img className="w-24 rounded-full" src={coin?.metadata.iconUrl}></img>
        ) : (
          <div className="w-24 flex items-center justify-center border-2 border-gray-300 h-[100px] rounded-full bg-gray-100">
            <MdInsertPhoto style={{ color: "gray" }}></MdInsertPhoto>
          </div>
        )}
        <div className="ml-4">
          <h4 className="text-2xl font-bold">Coin: {coin?.metadata.name}</h4>
          <div className="p-1 bg-gray-100 rounded-lg flex items-baseline gap-2">
            Type:
            <p className="font-bold text-sm">{coin?.type}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4 h-max">
        <div className="bg-gray-100 rounded-lg w-3/5 p-4 h-max">
          <div className="p-4">
            <p>Description</p>
            <p>{coin?.metadata.description}</p>
          </div>
          <div className="p-4">
            <p>Package ID</p>
            <p>{id?.slice(0, 66)}</p>
          </div>
          <div className="p-4">
            <p>Creator</p>
            <p>{coin?.owmer}</p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg w-2/5 p-8 flex flex-col justify-between h-max">
          <div className="flex flex-col gap-8">
            <div className="flex flex-row items-baseline justify-between">
              <h4 className="text-xl font-bold">{coin?.metadata.name} Supply</h4>
              <h1 className="text-xl font-bold">{coin ? Number(coin?.supply.value) / Number(Math.pow(10, coin?.metadata.decimals!)) : ""}</h1>
            </div>
            <div className="flex flex-row items-baseline justify-between">
              <h4 className="text-xl font-bold">{coin?.metadata.name} Balance</h4>
              <h1 className="text-xl font-bold">{coin ? Number(currentBalance) / Number(Math.pow(10, coin?.metadata.decimals!)) : ""}</h1>
            </div>
          </div>

          <div className="flex flex-row justify-end gap-4 mt-8">
            {coinObjects && coinObjects.length > 0 && (
              <>
                <button className="bg-red-400 text-white font-bold hover:bg-red-500" onClick={() => handleOpen(setModals, "burnModal")}>
                  Burn
                </button>
                <BurnCoinModal
                  open={modals.burnModal}
                  burnCoin={burn}
                  burnBalance={burnBalance}
                  handleBurnBalance={setBurnBalance}
                  handleClose={() => handleClose(setModals, "burnModal")}
                  handleOpen={() => {}}
                  disable={burnBalance <= 0}
                />
                <button className="bg-sky-400 text-white font-bold hover:bg-sky-500" onClick={() => handleOpen(setModals, "transferModal")}>
                  Transfer
                </button>
                <TransferCoinModal
                  open={modals.transferModal}
                  transferCoin={transfer}
                  form={transferForm}
                  handleForm={setTransferForm}
                  handleClose={() => handleClose(setModals, "transferModal")}
                  disable={transferDisable}
                />
              </>
            )}
            <button className="bg-green-400 text-white font-bold hover:bg-green-500" onClick={() => handleOpen(setModals, "mintAndTransferModal")}>
              Mint and Transfer
            </button>
            <MintAndTransferModal
              open={modals.mintAndTransferModal}
              mintAndTransferCoin={mintAndTransfer}
              form={mintAndTransferForm}
              handleForm={setMintAndTransferForm}
              handleClose={() => handleClose(setModals, "mintAndTransferModal")}
              address={account?.address || ""}
              disable={mintAndTransferDisable}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetail;
