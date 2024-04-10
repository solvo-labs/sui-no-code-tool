const ParticipantsCard = () => {
  return (
    <div className="vesting-card p-4 rounded-lg bg-gray-100 hover:bg-h-gray cursor-pointer" key={"key"} onClick={() => {}}>
      <div className="flex flexdir-col items-center gap-4">
        <div className="flex flex-col w-3/5 text-wrap overflow-hidden">
          <p className="font-bold text-xl">Participants</p>
          <div className="mt-2">
            <p className="font-medium text-md text-gray-700">Address: 0xc0080d</p>
            <p className="font-medium text-md text-gray-700">Vesting Balance: 0</p>
            <p className="font-medium text-md text-gray-700">Start Date: 1 April 2024</p>
            <p className="font-medium text-md text-gray-700">End Date: 20 April 2024</p>
            <p className="font-medium text-md text-gray-700">Period: Daily</p>
          </div>
          {/* <p className="">Participants: 0 active participants</p> */}
        </div>
      </div>
    </div>
  );
};

export default ParticipantsCard;

// id: UID,
//     start_date: u64,
//     end_date: u64,
//     cliff_date: u64,
//     period: u64,
//     claimed_balance: u64,
//     vesting_balance : Balance<T>
