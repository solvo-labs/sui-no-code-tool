import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { SuiClient, SuiObjectResponse } from "@mysten/sui.js/client";
import { useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Loader } from "../../components/Loader";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import useGetCoinDetails from "../../hooks/useGetCoinDetails";
import { MdInsertPhoto } from "react-icons/md";
import TransferCoinModal from "../../components/TransferCoinModal";
import BurnCoinModal from "../../components/BurnCoinModal";
import { TransferForm } from "../../utils/types";

const TokenDetail = () => {
  const account = useCurrentAccount();
  const [suiClient] = useOutletContext<[suiClient: SuiClient]>();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [treasury, setTreasury] = useState<SuiObjectResponse>();
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  // const [coinData, setCoinData] = useState<{ metadata: CoinMetadata | null; supply: CoinSupply }>();
  // const [coinObjects, setCoinObjects] = useState<CoinStruct[]>();

  const { coin, coinObjects } = useGetCoinDetails(account!, suiClient, id!, setLoading);

  const [modals, setModals] = useState<{ transferModal: boolean; burnModal: boolean }>({
    transferModal: false,
    burnModal: false,
  });

  const [transferForm, setTransferForm] = useState<TransferForm>({
    recipient: "",
    balance: 0,
  });

  const [burnBalance, setBurnBalance] = useState<number>(0);

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

  // useEffect(() => {
  //   const init = async () => {
  //     if (id && account) {
  //       const co = await suiClient.getCoins({ owner: account.address, coinType: id });

  //       if (co.data.length > 0) {
  //         setCoinObjects(co.data);
  //       }

  //       console.log(co.data);

  //       const coinDetails = await getCoin(suiClient, id);

  //       setCoinData(coinDetails);

  //       const treasuryObject = await suiClient.getOwnedObjects({
  //         owner: account.address,
  //         filter: {
  //           MatchAll: [
  //             {
  //               StructType: "0x2::coin::TreasuryCap<" + id + ">",
  //             },
  //           ],
  //         },
  //         options: {
  //           showContent: true,
  //           showType: true,
  //         },
  //       });

  //       const to = treasuryObject.data[0];

  //       // console.log(to);

  //       setTreasury(to);
  //       setLoading(false);
  //     } else {
  //       // @to-do add toastr
  //       console.log("ERROR", "Something went wrong");
  //     }
  //   };

  //   init();
  // }, [account, id, suiClient]);

  const mintAndTransfer = async () => {
    try {
      if (account && treasury && id) {
        const tx = new TransactionBlock();

        tx.moveCall({
          typeArguments: [id],
          target: `0x2::coin::mint_and_transfer`,
          arguments: [tx.pure(treasury.data?.objectId), tx.pure(1000 * Math.pow(10, coin?.metadata?.decimals || 0)), tx.pure(account.address)],
        });

        signAndExecute(
          {
            transactionBlock: tx,
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

        const primaryObject = coinObjects[0].coinObjectId;

        const tokenDecimal = coin.metadata?.decimals || 0;
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
          arguments: [tx.pure(coin?.objectId), splitCoin],
        });

        signAndExecute(
          {
            transactionBlock: tx,
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
                  location.reload();
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
            transactionBlock: tx,
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
                  location.reload();
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-8 flex flex-col 2xl:w-10/12 xl:w-10/12 lg:w-11/12 gap-4 h-max">
      <div className="bg-gray-100 p-4 flex flex-row items-center rounded-lg">
        {coin?.metadata.iconUrl ? (
          <img className="w-24 rounded-full" src={coin?.metadata.iconUrl}></img>
        ) : (
          <div className="w-24 flex items-center justify-center border-2 border-gray-300 w-[100px] h-[100px] rounded-full bg-gray-100">
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
              <h1 className="text-xl font-bold">{Number(coin?.supply.value) / Math.pow(10, coin?.metadata.decimals!)}</h1>
            </div>
            <div className="flex flex-row items-baseline justify-between">
              <h4 className="text-xl font-bold">{coin?.metadata.name} Balance</h4>
              <h1 className="text-xl font-bold">{Number(coin?.supply.value) / Math.pow(10, coin?.metadata.decimals!)}</h1>
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
                  disable={false}
                  handleBurnBalance={setBurnBalance}
                  handleClose={() => handleClose(setModals, "burnModal")}
                  handleOpen={() => modals.burnModal}
                ></BurnCoinModal>
                <button className="bg-sky-400 text-white font-bold hover:bg-sky-500" onClick={() => handleOpen(setModals, "transferModal")}>
                  Transfer
                </button>
                <TransferCoinModal
                  open={modals.transferModal}
                  handleClose={() => handleClose(setModals, "transferModal")}
                  handleOpen={() => modals.transferModal}
                  handleRecipient={(e: any) => setTransferForm({ ...transferForm, recipient: e.target.value })}
                  handleBalance={(e: any) => setTransferForm({ ...transferForm, balance: Number(e.target.value) })}
                  transferCoin={transfer}
                  disable={false}
                ></TransferCoinModal>
              </>
            )}
            <button className="bg-green-300 text-white font-bold hover:bg-green-500"> Mint and Transfer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetail;
