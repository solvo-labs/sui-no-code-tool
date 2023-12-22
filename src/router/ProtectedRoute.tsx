import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
// import Loading from "../assets/loading-spinner.gif";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { useCurrentAccount, useCurrentWallet } from "@mysten/dapp-kit";

const ProtectedRoute: React.FC = () => {
  const account = useCurrentAccount();

  const { isConnected, isDisconnected, currentWallet } = useCurrentWallet();
  const [, setLoading] = useState<boolean>(true);

  const suiClient = new SuiClient({
    url: getFullnodeUrl("testnet"),
  });

  useEffect(() => {
    const localKey = localStorage.getItem("WK__LAST_CONNECT_WALLET_NAME");
    if (localKey === null) {
      setLoading(false);
    }
    if (currentWallet && isConnected) {
      setLoading(false);
    }
  }, [isConnected, currentWallet, isDisconnected, account]);

  // if (isConnecting || loading) {
  //   return (
  //     <div className="min-h-screen relative flex flex-col justify-center items-center">
  //       <img className="w-14 h-14" src={Loading} alt="Loading Spinner" />
  //     </div>
  //   );
  // }

  return isConnected ? (
    <div className="min-h-screen relative">
      <TopBar />
      <div className="h-[calc(100vh-96px)] flex flex-col">
        <Outlet context={[suiClient]} />
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
