import NFTCard from "../../components/NFTCard";
import useGetObjects from "../../hooks/useGetObjects";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { NftObject } from "../../utils/types";
import { useNavigate } from "react-router-dom";

const ListNFTs = () => {
  const wallet = useCurrentAccount();
  const navigate = useNavigate();
  const { nfts, objectLoading } = useGetObjects(wallet!);

  return (
    <div className="p-8 2xl:w-11/12 xl:w-11/12 md:w-11/12 sm:w-full xs:w-full 2xs:w-full">
      <h4 className="page-title">My Nft List</h4>
      <div className="grid gap-4 2xl:grid-cols-4 xl:grid-cols-4 lg:gridcols-3 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
        {nfts.map((nft: NftObject) => (
          <NFTCard nft={nft} key={nft.data.objectId} onClick={() => navigate("/list-nft/" + nft.data.objectId)}></NFTCard>
        ))}
      </div>
    </div>
  );
};

export default ListNFTs;
