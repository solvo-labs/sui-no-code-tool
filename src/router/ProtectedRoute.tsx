import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import Loading from "../assets/loading-spinner.gif";
import { WalletProvider, useWallet } from "@suiet/wallet-kit";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { WalletKitProvider } from "@mysten/wallet-kit";

const ProtectedRoute: React.FC = () => {
  const { connected, connecting, account } = useWallet();
  const [loading, setLoading] = useState<boolean>(true);

  const suiClient = new SuiClient({
    url: getFullnodeUrl("testnet"),
  });

  useEffect(() => {
    const localKey = localStorage.getItem("WK__LAST_CONNECT_WALLET_NAME");

    if (localKey === null) {
      setLoading(false);
    }

    if (account && localKey && connected) {
      setLoading(false);
    }
  }, [account, connected]);

  if (connecting || loading) {
    return (
      <div className="min-h-screen relative flex flex-col justify-center items-center">
        <img className="w-14 h-14" src={Loading} alt="Loading Spinner" />
      </div>
    );
  }

  return connected ? (
    <div className="min-h-screen relative">
      <TopBar />
      <div className="h-[calc(100vh-96px)] flex flex-col">
        <WalletProvider autoConnect>
          <WalletKitProvider>
            <Outlet context={[suiClient]} />
          </WalletKitProvider>
        </WalletProvider>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
