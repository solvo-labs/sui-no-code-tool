import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Input from "../../components/Input";
import ImageUpload from "../../components/ImageUpload";
import Button from "../../components/Button";
import { TokenForm } from "../../utils/types";
import { toolBox } from "../../utils";
import { NFTStorage } from "nft.storage";
import { useNavigate, useOutletContext } from "react-router-dom";
import { CompiledModule, witnessByteCode } from "../../lib/utils";
import init, * as wasm from "../../move-binary-format-wasm";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { fromHEX, normalizeSuiObjectId } from "@mysten/sui.js/utils";
import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { Loader } from "../../components/Loader";

const TokenMint = () => {
  const account = useCurrentAccount();
  const [suiClient] = useOutletContext<[suiClient: any]>();
  const [file, setFile] = useState<any>();
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const { handleFileClear } = toolBox();
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const [tokenFormData, setTokenFormData] = useState<TokenForm>({
    name: "",
    symbol: "",
    decimal: 8,
    asset: "",
    description: "",
  });

  useEffect(() => {
    const storeImage = async () => {
      if (file) {
        setFileLoading(true);
        const client = new NFTStorage({ token: import.meta.env.VITE_NFT_STORAGE_API_KEY });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const mintToken = async () => {
    if (account) {
      setLoading(true);
      await init();

      const compiledModule = new CompiledModule(JSON.parse(wasm.deserialize(witnessByteCode)))
        .updateConstant(0, tokenFormData.decimal.toString(), "9", "u8")
        .updateConstant(1, tokenFormData.symbol, "Symbol", "string")
        .updateConstant(2, tokenFormData.name, "Name", "string")
        .updateConstant(3, tokenFormData.description, "Description", "string")
        .updateConstant(4, tokenFormData.asset, "Icon_Url", "string")
        .changeIdentifiers({
          witness: tokenFormData.symbol,
          WITNESS: tokenFormData.symbol.toUpperCase(),
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
          transactionBlock: tx as any,
          account: account,
        },
        {
          onSuccess: (tx: any) => {
            suiClient
              .waitForTransactionBlock({
                digest: tx.digest,
              })
              .then(() => {
                navigate("/my-tokens");
                setLoading(false);
              });
          },
          onError: () => {
            setLoading(false);
          },
        }
      );
    }
  };

  const disable = useMemo(() => {
    return fileLoading || !tokenFormData.name || !tokenFormData.symbol;
  }, [fileLoading, tokenFormData]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center my-12">
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
          value={tokenFormData.name}
        />
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>) => setTokenFormData({ ...tokenFormData, symbol: event?.target.value })}
          placeholder="Symbol"
          title="Symbol"
          type="text"
          key={"nftSymbol"}
          isRequired={true}
          disable={fileLoading}
          value={tokenFormData.symbol}
        />
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>) => setTokenFormData({ ...tokenFormData, description: event?.target.value })}
          placeholder="Description"
          title="Description"
          type="text"
          key={"description"}
          isRequired={true}
          disable={fileLoading}
          value={tokenFormData.description}
        />
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>) => setTokenFormData({ ...tokenFormData, decimal: Number(event?.target.value) })}
          placeholder="Decimal"
          title="Decimal"
          type="number"
          key={"tokenDecimal"}
          isRequired={true}
          disable={fileLoading}
          value={tokenFormData.decimal}
        />
        <ImageUpload file={file} setFile={(data) => setFile(data)} loading={fileLoading} handleClear={() => handleFileClear} title="Upload image for Token"></ImageUpload>
        <div className="flex justify-center">
          <div className="w-1/2">
            <Button onClick={mintToken} disabled={disable} title="Create Token"></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenMint;
