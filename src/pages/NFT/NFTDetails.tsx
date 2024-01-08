import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import useGetNftDetails from "../../hooks/useGetNftDetails";
import { hexFormatter } from "../../utils";
import { MdInsertPhoto } from "react-icons/md";
import { useCurrentAccount, useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useState } from "react";
import { ROUTES } from "../../utils/enum";
import TransferNftModal from "../../components/TransferNftModal";
import DeleteNftModal from "../../components/DeleteNftModal";

const NFTDetails = () => {
  const [suiClient] = useOutletContext<[suiClient: any]>();
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  const params = useParams();
  const account = useCurrentAccount();
  const navigate = useNavigate();
  const nftObjectID = params.id;
  const { nftDetail } = useGetNftDetails(nftObjectID!);
  const [recipient, setRecipient] = useState<string>("");

  const [transferOpen, setTransferOpen] = useState<boolean>(false);
  const [burnOpen, setBurnOpen] = useState<boolean>(false);

  const handleOpen = (setState: any) => {
    setState(true);
  };
  const handleClose = (setState: any) => {
    setState(false);
  };

  const transferNft = async () => {
    try {
      if (account && nftObjectID && recipient) {
        const tx = new TransactionBlock();
        tx.moveCall({
          target: "0x44d12155bb085df7d5432f0ad2419eb46195c449c327c716f43b733cfd17884d::devnet_nft::transfer",
          arguments: [tx.object(nftObjectID), tx.pure(recipient)],
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
                  setTransferOpen(false);
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

  const burnNFT = async () => {
    try {
      if (account && nftObjectID) {
        const tx = new TransactionBlock();

        tx.moveCall({
          target: "0x44d12155bb085df7d5432f0ad2419eb46195c449c327c716f43b733cfd17884d::devnet_nft::burn",
          arguments: [tx.object(nftObjectID)],
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
                  setBurnOpen(false);
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

  return (
    <div className="p-8 flex flex-col 2xl:w-4/5 xl:w-4/5 lg:w-11/12">
      <div className="flex flex-row justify-between items-baseline">
        <h4 className="page-title">NFT: {nftDetail?.data.content.fields.name}</h4>
        <div>
          <button className="hover:bg-h-gray" onClick={() => handleOpen(setTransferOpen)}>
            Transer NFT
          </button>
          <button className="hover:bg-h-gray" onClick={() => handleOpen(setBurnOpen)}>
            Burn NFT
          </button>
        </div>
      </div>

      <div className="flex items-center">
        {nftDetail?.data.content.fields.url ? (
          <img className="w-4/12 rounded-lg" src={nftDetail?.data.content.fields.url} alt={nftDetail?.data.content.fields.name}></img>
        ) : (
          <div className="w-4/12 h-full rounded-lg bg-gray-100 flex items-center justify-center">
            <MdInsertPhoto size={50}></MdInsertPhoto>
          </div>
        )}
        <div className="flex flex-col justify-center bg-gray-100 rounded-lg p-8 ml-4 w-8/12 h-full">
          <div className="grid grid-cols-2 divide-x divide-blue-400">
            <div className="flex flex-col justify-center items-center">
              <p className="font-bold text-lg">Object ID</p>
              <p>{nftDetail?.data.objectId ? hexFormatter(nftDetail?.data?.objectId) : "undefined"}</p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <p className="font-bold text-lg">Owner's Account</p>
              <p>{nftDetail?.data.owner ? hexFormatter(nftDetail?.data?.owner) : "undefined"}</p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg grid grid-row-2 p-4 mt-8 gap-4">
            <div>
              <p className="font-bold text-lg">Last Transaction Block ID</p>
              <p>{nftDetail?.data.previousTransaction}</p>
            </div>
            <div>
              <p className="font-bold text-lg">Storage Rebate</p>
              <p>{nftDetail?.data.storageRebate}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-between">
        <div className="flex bg-gray-100 rounded-lg px-2 gap-2">
          <p>Version: </p>
          <p className="font-semibold">{nftDetail?.data.version}</p>
        </div>
        <div className="flex bg-gray-100 rounded-lg px-2 gap-2">
          <p>Type:</p>
          <a className="font-semibold cursor-pointer hover:underline hover:underline-offset-2">{nftDetail?.data.type}</a>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-xl flex flex-col p-8 my-4 gap-4">
        <h5 className="text-2xl font-bold">Fields</h5>
        <div className="ml-8">
          <p className="font-bold text-lg">Name</p>
          <p>{nftDetail?.data.content.fields.name}</p>
        </div>
        <div className="ml-8 overflow-hidden">
          <p className="font-bold text-lg">Description</p>
          <p>{nftDetail?.data.content.fields.description}</p>
        </div>
        <div className="ml-8">
          <p className="font-bold text-lg">Url</p>
          <p>{nftDetail?.data.content.fields.url}</p>
        </div>
      </div>
      <TransferNftModal
        open={transferOpen}
        handleOpen={() => transferOpen}
        handleClose={() => handleClose(setTransferOpen)}
        handleRecipient={setRecipient}
        disable={!recipient}
        transferNft={transferNft}
      ></TransferNftModal>
      <DeleteNftModal open={burnOpen} handleOpen={() => handleOpen(setBurnOpen)} handleClose={() => handleClose(setBurnOpen)} burnNft={burnNFT}></DeleteNftModal>
    </div>
  );
};

export default NFTDetails;
