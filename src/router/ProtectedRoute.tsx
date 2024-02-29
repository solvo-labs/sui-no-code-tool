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
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-1 bg-white">
        <TopBar />
      </div>
      <div className="flex justify-center flex-grow">
        <Outlet context={[suiClient]} />
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
