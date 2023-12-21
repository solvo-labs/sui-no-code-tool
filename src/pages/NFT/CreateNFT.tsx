import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import ImageUpload from "../../components/ImageUpload";
import { NftForm } from "../../utils/types";
import { NFTStorage, Blob } from "nft.storage";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useOutletContext } from "react-router-dom";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { fromHEX } from "@mysten/bcs";

const CreateNFT = () => {
  const app_keypair = process.env.REACT_APP_KEYPAIR;

  const [suiClient] = useOutletContext<[suiClient: any]>();
  const [file, setFile] = useState<any>();
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [nftFormData, setNftFormData] = useState<NftForm>({
    name: "",
    symbol: "",
    asset: "",
  });

  const handleClear = () => {
    setFile(null);
    setNftFormData({ ...nftFormData, asset: "" });
  };

  const disable = useMemo(() => {
    return fileLoading || !nftFormData.name || !nftFormData.symbol;
  }, [fileLoading, nftFormData]);

  const createNft = async () => {
    try {
      if (app_keypair) {
        const tx = new TransactionBlock();
        const keypair = Ed25519Keypair.fromSecretKey(fromHEX(app_keypair));
        console.log(tx);

        tx.moveCall({
          target: "0x44d12155bb085df7d5432f0ad2419eb46195c449c327c716f43b733cfd17884d::devnet_nft::mint_to_sender",
          arguments: [tx.pure.string(nftFormData.name), tx.pure.string(nftFormData.symbol), tx.pure.string(nftFormData.asset)],
          typeArguments: [],
        });
        console.log("nerdeyim");

        const result = await suiClient.signAndExecuteTransactionBlock({
          transactionBlock: tx,
          signer: keypair,
          options: { showBalanceChanges: true, showEffects: true, showEvents: true, showInput: true, showObjectChanges: true, showRawInput: true },
        });

        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const storeImage = async () => {
      if (file && process.env.REACT_APP_NFT_STORAGE_API_KEY) {
        setFileLoading(true);
        const client = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_API_KEY });

        const fileCid = await client.storeBlob(new Blob([file]));
        setTimeout(() => {
          const fileUrl = "https://ipfs.io/ipfs/" + fileCid;
          setNftFormData({
            ...nftFormData,
            asset: fileUrl,
          });
        }, 1000);
        setFileLoading(false);
      }
    };

    storeImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <div className="flex flex-col items-center justify-center my-12">
      <div>
        <p className="page-title">Create your NFT</p>
      </div>
      <div className="flex flex-col w-96 gap-8">
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>) => setNftFormData({ ...nftFormData, name: event?.target.value })}
          placeholder="Name"
          title="Name"
          type="text"
          key={"nftName"}
          isRequired={true}
          disable={fileLoading}
        ></Input>
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>) => setNftFormData({ ...nftFormData, symbol: event?.target.value })}
          placeholder="Symbol"
          title="Symbol"
          type="text"
          key={"nftSymbol"}
          isRequired={true}
          disable={fileLoading}
        ></Input>
        <ImageUpload file={file} setFile={(data) => setFile(data)} loading={fileLoading} handleClear={handleClear}></ImageUpload>
        <div className="flex justify-center">
          <div className="w-2/5">
            <Button disabled={disable} onClick={createNft} title="Create NFT"></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;
