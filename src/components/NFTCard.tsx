import { NftObject } from "../utils/types";
import { MdInsertPhoto } from "react-icons/md";
import "../index.css";

type Props = {
  nft: NftObject;
};

const NFTCard: React.FC<Props> = ({ nft }) => {
  return (
    <div className="nft-card" key={nft.data.objectId}>
      <div className="flex flexdir-col items-center gap-4">
        {!nft.data.content.fields.url ? (
          <div className="flex items-center justify-center border-2 border-gray-300 w-[100px] h-[100px] rounded-full bg-gray-100">
            <MdInsertPhoto style={{ color: "gray" }}></MdInsertPhoto>
          </div>
        ) : (
          <img className="w-[100px] h-[100px] rounded-full" src={nft.data.content.fields.url} alt={nft.data.content.fields.name}></img>
        )}
        <div className="flex flex-col">
          <p className="font-bold text-xl">{nft.data.content?.fields.name}</p>
          <p>{nft.data.content?.fields.description}</p>
          <p>{nft.data.objectId.slice(0, 5) + "..." + nft.data.objectId.slice(-5)} </p>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
