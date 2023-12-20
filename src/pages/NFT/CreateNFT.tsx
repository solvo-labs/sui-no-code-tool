import { ChangeEvent, useEffect, useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import ImageUpload from "../../components/ImageUpload";
import { NftForm } from "../../utils/types";
import { NFTStorage, Blob, File } from "nft.storage";

const CreateNFT = () => {
  const [file, setFile] = useState<any>();
  const [fileLoading, setFileLoading] = useState<boolean>(false);

  const [nftFormData, setNftFormData] = useState<NftForm>({
    name: "",
    symbol: "",
    asset: "",
  });

  const handleClear = () => {
    setFile(null);
    // setNftFormData({ ...nftFormData, asset: "" });
  };

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
  }, [file, nftFormData]);

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
        ></Input>
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>) => setNftFormData({ ...nftFormData, symbol: event?.target.value })}
          placeholder="Symbol"
          title="Symbol"
          type="text"
          key={"nftSymbol"}
          isRequired={true}
        ></Input>
        <ImageUpload file={file} setFile={(data) => setFile(data)} loading={fileLoading} handleClear={handleClear}></ImageUpload>
        <div className="flex justify-center">
          <div className="w-2/5">
            <Button onClick={() => console.log(nftFormData)} title="Create NFT"></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;
