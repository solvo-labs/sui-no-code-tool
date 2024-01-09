import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";

import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { useCurrentWallet } from "@mysten/dapp-kit";
import { Loader } from "../components/Loader";
import { sleep } from "../utils";

const ProtectedRoute: React.FC = () => {
  const { isConnected, isConnecting } = useCurrentWallet();
  const [loading, setLoading] = useState<boolean>(true);

  const suiClient = new SuiClient({
    url: getFullnodeUrl("testnet"),
  });

  useEffect(() => {
    sleep(100).then(() => {
      setLoading(false);
    });
  }, []);

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
