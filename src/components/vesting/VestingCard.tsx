type Props = {
  vesting: any;
  handleClick: () => void;
};

const VestingCard: React.FC<Props> = ({ vesting, handleClick }) => {
  return (
    <div className="vesting-card p-4 rounded-lg hover:bg-h-gray cursor-pointer shadow-lg" key={"key"} onClick={handleClick}>
      <div className="flex flexdir-col items-center gap-4">
        {/* {nft.data.content?.fields.url ? (
          <img className="w-[100px] h-[100px] rounded-full" src={nft.data.content.fields.url} alt={nft.data.content.fields.name}></img>
        ) : (
          <div className="flex items-center justify-center border-2 border-gray-300 w-[100px] h-[100px] rounded-full bg-gray-100">
            <MdInsertPhoto style={{ color: "gray" }}></MdInsertPhoto>
          </div>
        )} */}
        <div className="flex flex-col text-wrap overflow-hidden">
          <p className="font-bold text-xl">Name: {vesting.content!.fields.name}</p>
          <p className="font-medium text-sm">ObjectID: {vesting.objectId}</p>
          {/* <p className="font-medium text-sm">Participants: {vesting.content!.fields.items.fields.size}</p> */}
          {/* <Tooltip isOpen={true} position="bottom" title={nft.data.content.fields.description}></Tooltip> */}
          {/* <p>Object: nft.data.objectId.slice(0, 5) + "..." + nft.data.objectId.slice(-5) </p> */}
          {/* <p>Collection: </p> */}
        </div>
      </div>
    </div>
  );
};

export default VestingCard;
