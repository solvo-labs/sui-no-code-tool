import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { CoinMetadata, CoinSupply, SuiClient, SuiObjectResponse } from "@mysten/sui.js/client";
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

  useEffect(() => {
    const init = async () => {
      if (id && account) {
        // const objectId = id.split("::")[0];

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

        console.log(treasury);

        tx.moveCall({
          typeArguments: [id],
          target: `0x2::coin::mint_and_transfer`,
          arguments: [tx.pure(treasury.data?.objectId), tx.pure(1000 * Math.pow(10, coinData?.metadata?.decimals || 0)), tx.pure(account.address)],
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

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div>{coinData?.metadata?.name + "/" + coinData?.metadata?.symbol}</div>
      <button onClick={mintAndTransfer}>Run</button>
    </>
  );
};

export default TokenDetail;
