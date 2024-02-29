import { ChangeEvent, useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";

import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import init, * as wasm from "../../move-binary-format-wasm";
import { CompiledModule } from "../../lib/utils";
import { nftByteCode } from "../../utils";
import { fromHEX, normalizeSuiObjectId } from "@mysten/sui.js/utils";
import { Loader } from "../../components/Loader";

const CreateCollection = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  const navigate = useNavigate();

  const [suiClient] = useOutletContext<[suiClient: any]>();
  const [collectionName, setCollectionName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const createCollection = async () => {
    try {
      if (account && collectionName) {
        setLoading(true);
        await init();

        const compiledModule = new CompiledModule(JSON.parse(wasm.deserialize(nftByteCode))).changeIdentifiers({
          testnet_nft: collectionName,
          TestnetNFT: collectionName.toUpperCase(),
        });

        const bytesToPublish = wasm.serialize(JSON.stringify(compiledModule));

        const tx = new TransactionBlock();

        tx.setGasBudget(100000000);

        const [upgradeCap] = tx.publish({
          modules: [[...fromHEX(bytesToPublish)]],
          dependencies: [normalizeSuiObjectId("0x1"), normalizeSuiObjectId("0x2")],
        });

        tx.transferObjects([upgradeCap], tx.pure(account.address, "address"));

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
                .then(() => {
                  navigate("/my-collections");
                  setLoading(false);
                });
            },
            onError: () => {
              setLoading(false);
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center my-12">
      <div>
        <p className="page-title">Create New Collection</p>
      </div>
      <div className="flex flex-col w-96 gap-8">
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>) => setCollectionName(event.target.value)}
          placeholder="Name"
          title="Name"
          type="text"
          key={"nftName"}
          isRequired={true}
          value={collectionName}
        ></Input>
        <div className="flex justify-center">
          <div className="w-1/2">
            <Button disabled={!collectionName} onClick={createCollection} title="Create Collection"></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCollection;
