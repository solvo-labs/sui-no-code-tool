import { ChangeEvent, useEffect, useState } from "react";
import Input from "../../components/Input";
import ImageUpload from "../../components/ImageUpload";
import Button from "../../components/Button";
import { TokenForm } from "../../utils/types";
import { toolBox } from "../../utils";
import { NFTStorage } from "nft.storage";

const TokenMint = () => {
  const [tokenFormData, setTokenFormData] = useState<TokenForm>({
    name: "",
    symbol: "",
    asset: "",
  });

  const { handleFileClear } = toolBox();

  const [file, setFile] = useState<any>();
  const [fileLoading, setFileLoading] = useState<boolean>(false);

  useEffect(() => {
    const storeImage = async () => {
      if (file && process.env.REACT_APP_NFT_STORAGE_API_KEY) {
        setFileLoading(true);
        const client = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_API_KEY });

        const fileCid = await client.storeBlob(new Blob([file]));
        console.log(fileCid);

        // console.log("file", fileCid);
        // const fileUrl = "https://ipfs.io/ipfs/" + fileCid;

        // setNftMetadata({
        //   ...nftMetadata,
        //   asset: fileUrl,
        // });
        // setNftFormData({
        //   ...nftFormData,
        //   asset: fileUrl,
        // });
        setFileLoading(false);
      }
    };

    storeImage();
  }, [file, tokenFormData]);

  return (
    <div className="flex flex-col items-center justify-center my-12">
      <div>
        <p className="page-title">Create your Token</p>
      </div>
      <div className="flex flex-col w-96 gap-8">
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>) => setTokenFormData({ ...tokenFormData, name: event?.target.value })}
          placeholder="Name"
          title="Name"
          type="text"
          key={"nftName"}
          isRequired={true}
        ></Input>
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>) => setTokenFormData({ ...tokenFormData, symbol: event?.target.value })}
          placeholder="Symbol"
          title="Symbol"
          type="text"
          key={"nftSymbol"}
          isRequired={true}
        ></Input>
        <ImageUpload file={file} setFile={(data) => setFile(data)} loading={fileLoading} handleClear={() => handleFileClear}></ImageUpload>
        <div className="flex justify-center">
          <div className="w-2/5">
            <Button onClick={() => console.log(tokenFormData)} title="Create Token"></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenMint;
