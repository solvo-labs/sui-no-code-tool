import NFTCard from "../../components/NFTCard";
import useGetObjects from "../../hooks/useGetObjects";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { NftObject } from "../../utils/types";

const ListNFTs = () => {
  const wallet = useCurrentAccount();
  const { nfts, objectLoading } = useGetObjects(wallet!);

  if (objectLoading) {
  }

  return (
    <div className="p-8">
      <h4 className="page-title">My Nft List</h4>
      <div className="grid gap-4 xl:grid-cols-4 lg:gridcols-4 md:grid-cols-3 sm:grid-cols-2">
        {nfts.map((nft: NftObject) => (
          <NFTCard nft={nft} key={nft.data.objectId}></NFTCard>
        ))}
      </div>
    </div>
  );
};

export default ListNFTs;
