import useGetNFTs from "../../hooks/useGetNFTs";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";

const ListNFTs = () => {
  const wallet = useCurrentAccount();
  const { nfts } = useGetNFTs(wallet!);

  return (
    <div>
      <h4>baslik</h4>
      {nfts.map((nft: any, index: number) => (
        <p className="bg-sky-300 p-4" key={index}>
          {nft.data.content.fields.name}
        </p>
      ))}
    </div>
  );
};

export default ListNFTs;
