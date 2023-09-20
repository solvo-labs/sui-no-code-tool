import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { ConnectButton } from "@suiet/wallet-kit";
import { useWallet } from "@suiet/wallet-kit";

import Logo from "../assets/logo.jpeg";

const Login: React.FC = () => {
  const { connected } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (connected) {
      navigate("/");
    }
  }, [connected, navigate]);

  return (
    <div className="login flex flex-col justify-center items-center h-screen">
      <div className="login flex flex-col justify-around items-center rounded-2xl h-1/2 md:w-1/2 xs:w-3/4 shadow-lg">
        <div className="text-black text-center text-4xl font-bold p-4">SUI NOCODE TOOL</div>
        <div className="p-2">
          <img className="rounded-full h-32 w-32" src={Logo} alt="Sui Logo" />
        </div>
        <div className="p-4">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

export default Login;
