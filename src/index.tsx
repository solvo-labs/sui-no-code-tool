import React from "react";
import ReactDOM from "react-dom/client";
// import { Theme } from "@radix-ui/themes";
import reportWebVitals from "./reportWebVitals";

import "@mysten/dapp-kit/dist/index.css";
// import "@radix-ui/themes/styles.css";

import App from "./App";
import "./index.css";

import { getFullnodeUrl } from "@mysten/sui.js/client";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletKitProvider } from "@mysten/wallet-kit";

const queryClient = new QueryClient();

const networks = {
  mainnet: { url: getFullnodeUrl("mainnet") },
  devnet: { url: getFullnodeUrl("devnet") },
  testnet: { url: getFullnodeUrl("testnet") },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <SuiClientProvider networks={networks} defaultNetwork={"testnet"}>
      <WalletProvider autoConnect>
        <WalletKitProvider>
          <App />
        </WalletKitProvider>
      </WalletProvider>
    </SuiClientProvider>
  </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
