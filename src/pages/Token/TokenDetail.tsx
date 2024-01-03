import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { CoinMetadata, CoinStruct, CoinSupply, SuiClient, SuiObjectResponse } from "@mysten/sui.js/client";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { getCoin } from "../../utils";
import { Loader } from "../../components/Loader";
import { TransactionBlock } from "@mysten/sui.js/transactions";

const TokenDetail = () => {
  const [suiClient] = useOutletContext<[suiClient: SuiClient]>();
  const { id } = useParams();
  const account = useCurrentAccount();
  const [loading, setLoading] = useState<boolean>(true);
  const [coinData, setCoinData] = useState<{ metadata: CoinMetadata | null; supply: CoinSupply }>();
  const [treasury, setTreasury] = useState<SuiObjectResponse>();
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  const [coinObjects, setCoinObjects] = useState<CoinStruct[]>();

  useEffect(() => {
    const init = async () => {
      if (id && account) {
        const co = await suiClient.getCoins({ owner: account.address, coinType: id });

        if (co.data.length > 0) {
          setCoinObjects(co.data);
        }

        const coinDetails = await getCoin(suiClient, id);

        setCoinData(coinDetails);

        const treasuryObject = await suiClient.getOwnedObjects({
          owner: account.address,
          filter: {
            MatchAll: [
              {
                StructType: "0x2::coin::TreasuryCap<" + id + ">",
              },
            ],
          },
          options: {
            showContent: true,
            showType: true,
          },
        });

        const to = treasuryObject.data[0];

        setTreasury(to);
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
      if (account && treasury && id) {
        const tx = new TransactionBlock();

        // @to-do
        const targetAmountDummy = 1000;
        const targetAddress = account.address;

        tx.moveCall({
          typeArguments: [id],
          target: `0x2::coin::mint_and_transfer`,
          arguments: [tx.pure(treasury.data?.objectId), tx.pure(targetAmountDummy * Math.pow(10, coinData?.metadata?.decimals || 0)), tx.pure(targetAddress)],
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
      if (account && treasury && id && coinObjects && coinData) {
        const tx = new TransactionBlock();

        // @to-do
        const sampleTargetAmount = 2900;

        const primaryObject = coinObjects[0].coinObjectId;

        const tokenDecimal = coinData.metadata?.decimals || 0;
        const primaryBalance = coinObjects[0].balance;

        if (Number(primaryBalance) < sampleTargetAmount) {
          tx.mergeCoins(
            tx.object(primaryObject),
            coinObjects.slice(1)?.map((co) => tx.object(co.coinObjectId))
          );
        }

        const coin = tx.splitCoins(primaryObject, [tx.pure(sampleTargetAmount * Math.pow(10, tokenDecimal))]);

        tx.moveCall({
          typeArguments: [id],
          target: `0x2::coin::burn`,
          arguments: [tx.pure(treasury.data?.objectId), coin],
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

  const transfer = () => {
    try {
      if (account && treasury && id && coinObjects && coinData) {
        const tx = new TransactionBlock();

        // @to-do temp hardcoded
        const sampleTargetAmount = 1000;
        const targetAddress = "0x092f9ff7cbe988d197d407357e1d9186b3cdf761e6bef09cfdaca35c20941ec6";

        const tokenDecimal = coinData.metadata?.decimals || 0;

        const primaryObject = coinObjects[0].coinObjectId;
        const primaryBalance = coinObjects[0].balance;

        if (Number(primaryBalance) < sampleTargetAmount) {
          tx.mergeCoins(
            tx.object(primaryObject),
            coinObjects.slice(1)?.map((co) => tx.object(co.coinObjectId))
          );
        }

        const coin = tx.splitCoins(primaryObject, [tx.pure(sampleTargetAmount * Math.pow(10, tokenDecimal))]);
        tx.transferObjects([coin], tx.pure(targetAddress));

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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div>{coinData?.metadata?.name + "/" + coinData?.metadata?.symbol}</div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 block" onClick={mintAndTransfer}>
          Mint and Transfer
        </button>
        {coinObjects && coinObjects.length > 0 && (
          <>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2 block" onClick={burn}>
              Burn
            </button>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2 block" onClick={transfer}>
              Transfer
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TokenDetail;
