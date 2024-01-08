import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";

import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { useCurrentAccount, useCurrentWallet } from "@mysten/dapp-kit";
import { Loader } from "../components/Loader";

const ProtectedRoute: React.FC = () => {
  const account = useCurrentAccount();

  const { isConnected, isDisconnected, currentWallet, isConnecting } = useCurrentWallet();
  const [loading, setLoading] = useState<boolean>(true);

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

  if (isConnecting || loading) {
    return <Loader />;
  }

  return isConnected ? (
    <div className="min-h-screen relative">
      <TopBar />
      <div className="flex justify-center w-full h-full mb-8">
        <Outlet context={[suiClient]} />
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
