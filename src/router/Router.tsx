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
import Stake from "../pages/Stake/Stake";
import VestingList from "../pages/Tokenomics/VestingList";
import ContractPage from "../pages/ContractPage";
import Login from "../pages/Login";
import NotFoundPage from "../pages/NotFoundPage";
import CreateNFT from "../pages/NFT/CreateNFT";
import ListNFTs from "../pages/NFT/ListNFTs";
import NFTDetails from "../pages/NFT/NFTDetails";
import CreateCollection from "../pages/NFT/CreateCollection";
import CreateVesting from "../pages/Tokenomics/CreateVesting";
import CreateRaffle from "../pages/Raffle/CreateRaffle";
import JoinRaffle from "../pages/Raffle/JoinRaffle";
import ManageRaffle from "../pages/Raffle/ManageRaffle";
import ManageVesting from "../pages/Tokenomics/ManageVesting";
import VestingDetails from "../pages/Tokenomics/VestingDetails";

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
            <Route path={ROUTES.TOKEN_DETAILS} index element={<TokenDetail />} />
            <Route path="/stake" index element={<Stake />} />
            <Route path={ROUTES.CREATE_RAFFLE} index element={<CreateRaffle />} />
            <Route path={ROUTES.JOIN_RAFFLE} index element={<JoinRaffle />} />
            <Route path={ROUTES.MANAGE_RAFFLE} index element={<ManageRaffle />} />
            <Route path={ROUTES.TOKENOMICS_CREATE} index element={<CreateVesting />} />
            <Route path={ROUTES.TOKENOMICS_MANAGE} index element={<ManageVesting />} />
            <Route path={ROUTES.TOKENOMICS_LIST} index element={<VestingList />} />
            <Route path={ROUTES.TOKENOMICS_DETAILS} index element={<VestingDetails />} />
            <Route path="/contract" index element={<ContractPage />} />
            <Route path="/airdrop" index element={<Airdrop />} />

            <Route path={ROUTES.NFT_CREATE} index element={<CreateNFT />} />
            <Route path={ROUTES.NFT_LIST} index element={<ListNFTs />} />
            <Route path={ROUTES.NFT_DETAILS} index element={<NFTDetails />} />
            <Route path={ROUTES.CREATE_COLLECTION} index element={<CreateCollection />} />
          </Route>
          <Route path={ROUTES.LOGIN} index element={<Login />} />
          <Route path="*" index element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
