import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Input from "../../components/Input";
import ImageUpload from "../../components/ImageUpload";
import Button from "../../components/Button";
import { TokenForm } from "../../utils/types";
import { toolBox } from "../../utils";
import { NFTStorage } from "nft.storage";
// import { useOutletContext } from "react-router-dom";

const TokenMint = () => {
  // const [suiClient] = useOutletContext<[suiClient: any]>();
  const [file, setFile] = useState<any>();
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const { handleFileClear } = toolBox();

  const [tokenFormData, setTokenFormData] = useState<TokenForm>({
    name: "",
    symbol: "",
    decimal: 8,
    asset: "",
  });

  useEffect(() => {
    const storeImage = async () => {
      if (file && process.env.REACT_APP_NFT_STORAGE_API_KEY) {
        setFileLoading(true);
        const client = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_API_KEY });
        const fileCid = await client.storeBlob(new Blob([file]));
        const fileUrl = "https://ipfs.io/ipfs/" + fileCid;
        setTokenFormData({
          ...tokenFormData,
          asset: fileUrl,
        });
        setFileLoading(false);
      }
    };

    storeImage();
  }, [file, tokenFormData]);

  const disable = useMemo(() => {
    return fileLoading || !tokenFormData.name || !tokenFormData.symbol;
  }, [fileLoading, tokenFormData]);

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
          disable={fileLoading}
        ></Input>
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>) => setTokenFormData({ ...tokenFormData, symbol: event?.target.value })}
          placeholder="Symbol"
          title="Symbol"
          type="text"
          key={"nftSymbol"}
          isRequired={true}
          disable={fileLoading}
        ></Input>
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>) => setTokenFormData({ ...tokenFormData, decimal: Number(event?.target.value) })}
          placeholder="Decimal"
          title="Decimal"
          type="number"
          key={"tokenDecimal"}
          isRequired={true}
          disable={fileLoading}
        ></Input>
        <ImageUpload file={file} setFile={(data) => setFile(data)} loading={fileLoading} handleClear={() => handleFileClear} title="Upload image for Token"></ImageUpload>
        <div className="flex justify-center">
          <div className="w-2/5">
            <Button onClick={() => console.log(tokenFormData)} disabled={disable} title="Create Token"></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenMint;
