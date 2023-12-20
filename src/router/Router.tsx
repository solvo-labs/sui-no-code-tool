import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ROUTES } from "../utils/enum";
import ProtectedRoute from "./ProtectedRoute";
import Main from "../pages/Main";
import MyTokens from "../pages/Token/MyTokens";
import TokenMint from "../pages/Token/TokenMint";
import TokenDetail from "../pages/Token/TokenDetail";
import TokenTransfer from "../pages/Token/TokenTransfer";
import TokenMintAndBurn from "../pages/Token/TokenMintAndBurn";
import FreezeAccount from "../pages/Token/FreezeAccount";
import CloseAccount from "../pages/Token/CloseAccount";
import Multisignature from "../pages/Token/Multisignature";
import Airdrop from "../pages/Token/Airdrop";
import Raffle from "../pages/Token/Raffle";
import Stake from "../pages/Stake/Stake";
import Tokenomics from "../pages/Tokenomics/Tokenomics";
import VestingList from "../pages/Tokenomics/VestingList";
import Vesting from "../pages/Tokenomics/Vesting";
import ContractPage from "../pages/ContractPage";
import Login from "../pages/Login";
import NotFoundPage from "../pages/NotFoundPage";
import CreateNFT from "../pages/NFT/CreateNFT";

const Router: React.FC = () => {
  return (
    <>
      <BrowserRouter basename={"/"}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.MAIN} index element={<Main />} />
            <Route path={ROUTES.MY_TOKENS} index element={<MyTokens />} />
            <Route path={ROUTES.TOKEN_MINT} index element={<TokenMint />} />
            <Route path={ROUTES.TOKEN_TRANSFER} index element={<TokenTransfer />} />
            <Route path={ROUTES.TOKEN_MINT_BURN} index element={<TokenMintAndBurn />} />
            <Route path="/freeze-account" index element={<FreezeAccount />} />
            <Route path="/close-account" index element={<CloseAccount />} />
            <Route path="/multisignature" index element={<Multisignature />} />
            <Route path="/token/:id" index element={<TokenDetail />} />
            <Route path="/stake" index element={<Stake />} />
            <Route path="/raffle" index element={<Raffle />} />
            <Route path="/tokenomics" index element={<Tokenomics />} />
            <Route path="/vesting-list" index element={<VestingList />} />
            <Route path="/create-vesting/:tokenid/:name/:amount" index element={<Vesting />} />
            <Route path="/contract" index element={<ContractPage />} />
            <Route path="/airdrop" index element={<Airdrop />} />

            <Route path={ROUTES.NFT_CREATE} index element={<CreateNFT />} />
          </Route>
          <Route path={ROUTES.LOGIN} index element={<Login />} />
          <Route path="*" index element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
