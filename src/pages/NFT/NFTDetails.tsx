import { useParams } from "react-router-dom";
import useGetNftDetails from "../../hooks/useGetNftDetails";
import { hexFormatter } from "../../utils";
import { MdHeight, MdInsertPhoto, MdWidthNormal } from "react-icons/md";

const NFTDetails = () => {
  const params = useParams();
  const nftObjectID = params.id;
  const { nftDetail } = useGetNftDetails(nftObjectID!);

  return (
    <div className="p-8 mb-12 flex flex-col 2xl:w-4/5 xl:w-4/5 lg:w-11/12">
      <div className="flex flex-row justify-between items-baseline">
        <h4 className="page-title">NFT: {nftDetail?.data.content.fields.name}</h4>
        <div>
          <button>Transer NFT</button>
          <button>Burn NFT</button>
        </div>
      </div>

      <div className="flex items-center">
        {nftDetail?.data.content.fields.url ? (
          <img className="w-4/12 rounded-lg" src={nftDetail?.data.content.fields.url} alt={nftDetail?.data.content.fields.name}></img>
        ) : (
          <div className="w-4/12 h-full rounded-lg bg-gray-100 flex items-center justify-center">
            <MdInsertPhoto></MdInsertPhoto>
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
        <div className="ml-8">
          <p className="font-bold text-lg">Description</p>
          <p>{nftDetail?.data.content.fields.description}</p>
        </div>
      </div>
    </div>
  );
};

export default NFTDetails;
