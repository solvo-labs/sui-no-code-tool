import useGetObjects from "../../hooks/useGetObjects";
import { useCurrentAccount } from "@mysten/dapp-kit";

const ListNFTs = () => {
  const wallet = useCurrentAccount();
  const { nfts } = useGetObjects(wallet!);

  return (
    <div>
      <h4>My Nft List</h4>
      {nfts.map((nft: any, index: number) => (
        <p className="bg-sky-300 p-4" key={index}>
          {nft.data.content.fields.name}
        </p>
      ))}
    </div>
  );
};

export default ListNFTs;
