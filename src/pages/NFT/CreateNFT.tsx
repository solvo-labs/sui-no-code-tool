import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import ImageUpload from "../../components/ImageUpload";
import { NftForm } from "../../utils/types";
import { NFTStorage, Blob } from "nft.storage";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { ROUTES } from "../../utils/enum";

const CreateNFT = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  const navigate = useNavigate();

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
      if (account && nftFormData.asset) {
        const tx = new TransactionBlock();
        tx.moveCall({
          target: "0xa5fc600afc6f79ddb371372243575a875c2f14af64da39054167cfaf2dc112ac::col::mint_to_sender",
          arguments: [tx.pure.string(nftFormData.name), tx.pure.string(nftFormData.symbol), tx.pure.string(nftFormData.asset)],
          typeArguments: [],
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
                .then(() => {
                  navigate(ROUTES.NFT_LIST);
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

  useEffect(() => {
    const storeImage = async () => {
      if (file) {
        setFileLoading(true);
        const client = new NFTStorage({ token: import.meta.env.VITE_NFT_STORAGE_API_KEY });

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
    <div className="flex flex-col items-center my-12">
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
          value={nftFormData.name}
          isRequired={true}
          disable={fileLoading}
        ></Input>
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>) => setNftFormData({ ...nftFormData, symbol: event?.target.value })}
          placeholder="Description"
          title="Description"
          type="text"
          key={"nftDescription"}
          isRequired={true}
          value={nftFormData.symbol}
          disable={fileLoading}
        ></Input>
        <ImageUpload file={file} setFile={(data) => setFile(data)} loading={fileLoading} handleClear={handleClear} title="Upload image for NFT"></ImageUpload>
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
