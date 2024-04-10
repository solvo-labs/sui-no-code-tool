import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ConnectButton } from "@mysten/dapp-kit";
import { NFT_PAGES, RAFFLE_PAGES, ROUTES, TOKENOMICS_PAGES, TOKEN_PAGES, TOPBAR_PAGES } from "../utils/enum";
import MobileMenu from "./MobileMenu";

const TopBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<Boolean>(false);
  const navigate = useNavigate();

  const [isTokenHovered, setIsTokenHovered] = useState<Boolean>(false);
  const [isTokenomicsHovered, setIsTokenomicsHovered] = useState<Boolean>(false);
  const [isStakeHovered, setIsStakeHovered] = useState<Boolean>(false);
  const [isNFTHovered, setIsNFTHovered] = useState<Boolean>(false);
  const [isRaffleHovered, setIsRaffleHovered] = useState<Boolean>(false);

  const tokenModalRef = useRef<HTMLDivElement | null>(null);
  const tokenomicsModalRef = useRef<HTMLDivElement | null>(null);
  const stakeModalRef = useRef<HTMLDivElement | null>(null);
  const nftModalRef = useRef<HTMLDivElement | null>(null);
  const raffleModalRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOpenMenu = (setState: any) => {
    setIsNFTHovered(false);
    setIsTokenHovered(false);
    setIsTokenomicsHovered(false);
    setIsRaffleHovered(false);
    setState(true);
  };

  const handleCloseMenu = (setState: any) => {
    setState(false);
  };

  const handleRouter = (page: string) => {
    let entries = Object.entries(ROUTES);
    let [, value] = entries.find(([key]) => key === page) || [];

    if (value) {
      navigate(value);
    } else {
      console.error(`Route not found for page: ${page}`);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (tokenModalRef.current && !tokenModalRef.current.contains(event.target as Node)) {
      setIsTokenHovered(false);
    }
    if (tokenomicsModalRef.current && !tokenomicsModalRef.current.contains(event.target as Node)) {
      setIsTokenomicsHovered(false);
    }
    if (stakeModalRef.current && !stakeModalRef.current.contains(event.target as Node)) {
      setIsStakeHovered(false);
    }
    if (nftModalRef.current && !nftModalRef.current.contains(event.target as Node)) {
      setIsNFTHovered(false);
    }
    if (raffleModalRef.current && !raffleModalRef.current.contains(event.target as Node)) {
      setIsRaffleHovered(false);
    }
  };

  useEffect(() => {
    if (isTokenHovered || isTokenomicsHovered || isStakeHovered || isNFTHovered) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTokenHovered, isTokenomicsHovered, isStakeHovered, isNFTHovered]);

  const pageLister = (pages: Object) => {
    const entries = Object.entries(pages);

    return entries.map(([pageKey, pageValue]: [string, any]) => (
      <li key={pageKey} className="text-navbar-gray hover:text-sui-blue cursor-pointer" onClick={() => handleRouter(pageKey)}>
        {pageValue}
      </li>
    ));
  };

  return (
    <nav>
      <div className="mx-8 top-0 z-50 flex justify-between items-center h-24">
        <div className="text-4xl font-semibold cursor-pointer text-black hover:text-sui-blue">
          <Link to="/">SUI NOCODE TOOL</Link>
        </div>
        <div className="gap-12 items-center xl:flex 2xl:flex lg:flex hidden">
          <ul className="flex flex-column gap-12 ">
            <li className="relative group">
              <div onMouseEnter={() => handleOpenMenu(setIsTokenHovered)} className="cursor-pointer font-semibold text-xl text-sui-gray hover:text-sui-blue">
                {TOPBAR_PAGES.TOKEN}
              </div>
              {isTokenHovered && (
                <div ref={tokenModalRef} onMouseLeave={() => handleCloseMenu(setIsTokenHovered)} className="pages-modal">
                  <ul className="space-y-2">{pageLister(TOKEN_PAGES)}</ul>
                </div>
              )}
            </li>
            <li className="relative group">
              <div onMouseEnter={() => handleOpenMenu(setIsTokenomicsHovered)} className="cursor-pointer font-semibold text-xl text-sui-gray hover:text-sui-blue">
                {TOPBAR_PAGES.TOKENOMICS}
              </div>
              {isTokenomicsHovered && (
                <div ref={tokenomicsModalRef} onMouseLeave={() => handleCloseMenu(setIsTokenomicsHovered)} className="pages-modal">
                  <ul className="space-y-2">{pageLister(TOKENOMICS_PAGES)}</ul>
                </div>
              )}
            </li>
            <li className="relative group">
              <div onMouseEnter={() => handleOpenMenu(setIsNFTHovered)} className="cursor-pointer font-semibold text-xl text-sui-gray hover:text-sui-blue">
                {TOPBAR_PAGES.NFT}
              </div>
              {isNFTHovered && (
                <div ref={nftModalRef} onMouseLeave={() => handleCloseMenu(setIsNFTHovered)} className="pages-modal">
                  <ul className="space-y-2">{pageLister(NFT_PAGES)}</ul>
                </div>
              )}
            </li>
            <li className="relative group">
              <div onMouseEnter={() => handleOpenMenu(setIsRaffleHovered)} className="cursor-pointer font-semibold text-xl text-sui-gray hover:text-sui-blue">
                {TOPBAR_PAGES.RAFFLE}
              </div>
              {isRaffleHovered && (
                <div ref={nftModalRef} onMouseLeave={() => handleCloseMenu(setIsRaffleHovered)} className="pages-modal">
                  <ul className="space-y-2">{pageLister(RAFFLE_PAGES)}</ul>
                </div>
              )}
            </li>
            <li className="relative group">
              <div className="cursor-pointer font-semibold text-sui-gray text-xl hover:text-sui-blue">
                <Link to={"/stake"}>{TOPBAR_PAGES.STAKE}</Link>
              </div>
            </li>
          </ul>
          <ConnectButton />
        </div>
        <div className={`lg:hidden`}>
          <MobileMenu handleToggle={toggleMenu} />
        </div>
        {isMenuOpen && (
          <div className="absolute top-0 right-0 w-1/2 h-screen bg-white z-50 mt-24">
            <div className="p-4">
              <ul className="space-y-4">
                <li>
                  <Link onClick={toggleMenu} to="/my-tokens" className="text-navbar-gray hover:text-blue block">
                    MY TOKENS
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopBar;
