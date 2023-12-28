import { NftObject } from "../utils/types";
import { MdInsertPhoto } from "react-icons/md";
import "../index.css";

type Props = {
  nft: NftObject;
  onClick: () => void;
};

const NFTCard: React.FC<Props> = ({ nft, onClick }) => {
  return (
    <div className="nft-card" key={nft.data.objectId} onClick={onClick}>
      <div className="flex flexdir-col items-center gap-4">
        {nft.data.content?.fields.url ? (
          <img className="w-[100px] h-[100px] rounded-full" src={nft.data.content.fields.url} alt={nft.data.content.fields.name}></img>
        ) : (
          <div className="flex items-center justify-center border-2 border-gray-300 w-[100px] h-[100px] rounded-full bg-gray-100">
            <MdInsertPhoto style={{ color: "gray" }}></MdInsertPhoto>
          </div>
        )}
        <div className="flex flex-col w-3/5 text-wrap overflow-hidden">
          <p className="font-bold text-xl">{nft.data.content.fields.name}</p>
          <p className="">{nft.data.content.fields.description.length > 30 ? nft.data.content.fields.description.slice(0, 20) + " ..." : nft.data.content.fields.description}</p>
          {/* <Tooltip isOpen={true} position="bottom" title={nft.data.content.fields.description}></Tooltip> */}
          <p>{nft.data.objectId.slice(0, 5) + "..." + nft.data.objectId.slice(-5)} </p>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
