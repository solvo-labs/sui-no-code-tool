import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import ProcessButton from "../components/ProcessButton";
import { ConnectButton, useCurrentWallet } from "@mysten/dapp-kit";

const Login: React.FC = () => {
  const { isConnected, isConnecting, isDisconnected } = useCurrentWallet();

  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      navigate("/create-token");
    }
  }, [isConnected, navigate]);

  return (
    <div className="login flex flex-col justify-center items-center h-screen">
      <div className="login-card flex flex-col justify-around items-center rounded-2xl h-1/2 2xl:w-1/4 xl:w-1/3 lg:w-1/3 md:w-1/2 sm:w-3/4 xs:w-3/4 shadow-xl">
        <div className="text-black text-center text-4xl font-bold p-4">SUI NOCODE TOOL</div>
        <div className="p-2">
          <img className="rounded-full h-32 w-32 shadow-xl border-solid border-2 border-sky-300" src={Logo} alt="Sui Logo" />
        </div>
        {isDisconnected && (
          <div className="p-4">
            <ConnectButton style={{ width: "180px", backgroundColor: "#3898EC", borderRadius: "200px", color: "white", fontWeight: "bold", padding: "12px" }} />
          </div>
        )}
        {isConnecting && (
          <div className="p-4 w-full flex flex-col items-center">
            <ProcessButton title="Connecting"></ProcessButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
