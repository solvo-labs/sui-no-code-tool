import React from "react";
import { vestMulti } from "../../lib/vesting";
import { useWallet } from "@suiet/wallet-kit";

const CreateVesting = () => {
  const wallet = useWallet();
  const run = () => {
    console.log("here");
    // vestMulti(wallet,);
  };

  return <button onClick={run}> Run</button>;
};

export default CreateVesting;
