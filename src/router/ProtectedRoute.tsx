import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import Loading from "../assets/loading-spinner.gif";
import { useWallet } from "@suiet/wallet-kit";

const ProtectedRoute: React.FC = () => {
  const { connected, connecting, account } = useWallet();
  const [loading, setLoading] = useState<boolean>(true);

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
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
