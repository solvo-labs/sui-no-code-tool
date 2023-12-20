import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@suiet/wallet-kit";
import { useWallet } from "@suiet/wallet-kit";
import Logo from "../assets/logo.jpeg";
import ProcessButtton from "../components/ProcessButton";

const Login: React.FC = () => {
  const { connected, status } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (connected) {
      navigate("/");
    }
  }, [connected, navigate]);

  return (
    <div className="login flex flex-col justify-center items-center h-screen">
      <div className="login-card flex flex-col justify-around items-center rounded-2xl h-1/2 2xl:w-1/4 xl:w-1/3 lg:w-1/3 md:w-1/2 sm:w-3/4 xs:w-3/4 shadow-xl">
        <div className="text-black text-center text-4xl font-bold p-4">SUI NOCODE TOOL</div>
        <div className="p-2">
          <img className="rounded-full h-32 w-32 shadow-xl border-solid border-2 border-sky-300" src={Logo} alt="Sui Logo" />
        </div>
        {status === "disconnected" && (
          <div className="p-4">
            <ConnectButton style={{ width: "200px", backgroundColor: "#3898EC", borderRadius: "200px" }} />
          </div>
        )}
        {status === "connecting" && (
          <div className="p-4 w-full flex flex-col items-center">
            <ProcessButtton title="Connecting"></ProcessButtton>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
