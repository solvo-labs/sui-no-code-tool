import VestingCard from "../../components/vesting/VestingCard";
import { useNavigate, useOutletContext } from "react-router-dom";
import useGetVestingObject from "../../hooks/useGetVestingObject";
import { useCurrentAccount } from "@mysten/dapp-kit";

const ManageVesting = () => {
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const [suiClient] = useOutletContext<[suiClient: any]>();

  const { vestings } = useGetVestingObject(account!, suiClient);

  return (
    <div className="p-8 2xl:w-11/12 xl:w-11/12 md:w-11/12 sm:w-full xs:w-full 2xs:w-full">
      <h4 className="page-title">Manage Vesting</h4>
      <div className="grid gap-4 2xl:grid-cols-3 xl:grid-cols-2 lg:gridcols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
        {vestings.map((vesting: any) => (
          <VestingCard key={vesting.objectId} vesting={vesting} handleClick={() => navigate("/vesting-detail/" + vesting.objectId)}></VestingCard>
        ))}
      </div>
    </div>
  );
};

export default ManageVesting;
