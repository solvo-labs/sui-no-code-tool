import useGetNFTs from "../../hooks/useGetNFTs";
import { useCurrentAccount } from "@mysten/dapp-kit";

const ListNFTs = () => {
  const wallet = useCurrentAccount();
  const { nfts } = useGetNFTs(wallet!);

  return (
    <div>
      <h4>baslik</h4>
      {nfts.map((nft: any, index: number) => (
        <p className="bg-sky-300" key={index}>
          {nft.data.objectId}
        </p>
      ))}
    </div>
  );
};

export default ListNFTs;
