import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { ConnectButton } from "@suiet/wallet-kit";

const TopBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<Boolean>(false);

  const [isTokenHovered, setIsTokenHovered] = useState<Boolean>(false);
  const [isTokenomicsHovered, setIsTokenomicsHovered] = useState<Boolean>(false);
  const [isStakeHovered, setIsStakeHovered] = useState<Boolean>(false);

  const tokenModalRef = useRef<HTMLDivElement | null>(null);
  const tokenomicsModalRef = useRef<HTMLDivElement | null>(null);
  const stakeModalRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleTokenHover = () => {
    setIsTokenHovered(true);
    setIsTokenomicsHovered(false);
    setIsStakeHovered(false);
  };

  const handleTokenomicsHover = () => {
    setIsTokenHovered(false);
    setIsTokenomicsHovered(true);
    setIsStakeHovered(false);
  };

  const handleStakeHover = () => {
    setIsTokenHovered(false);
    setIsTokenomicsHovered(false);
    setIsStakeHovered(true);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (tokenModalRef.current && !tokenModalRef.current.contains(e.target as Node)) {
      setIsTokenHovered(false);
    }
    if (tokenomicsModalRef.current && !tokenomicsModalRef.current.contains(e.target as Node)) {
      setIsTokenomicsHovered(false);
    }
    if (stakeModalRef.current && !stakeModalRef.current.contains(e.target as Node)) {
      setIsStakeHovered(false);
    }
  };

  useEffect(() => {
    if (isTokenHovered || isTokenomicsHovered || isStakeHovered) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTokenHovered, isTokenomicsHovered, isStakeHovered]);

  return (
    <nav className="bg-white p-4 sticky top-0 z-50 h-24 flex">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-3xl font-semibold cursor-pointer text-black hover:text-blue">
          <Link to="/">SUI NOCODE TOOL</Link>
        </div>
        <div className="xl:block 2xl:block xxl:block lg:block hidden">
          <ul className="flex items-center space-x-4">
            <li className="relative group">
              <div onMouseEnter={handleTokenHover} className="px-3 py-2 rounded cursor-pointer text-navbar-gray hover:text-blue">
                TOKEN
              </div>
              {isTokenHovered && (
                <div ref={tokenModalRef} className="absolute left-0 mt-1 w-40 bg-white p-4 rounded shadow-md">
                  <ul className="space-y-2">
                    <li className="text-navbar-gray hover:text-blue cursor-pointer">
                      <Link to="/my-tokens">MY TOKENS</Link>
                    </li>
                    <li className="text-navbar-gray hover:text-blue cursor-pointer">
                      <Link to="/token-create">TOKEN MINT</Link>
                    </li>
                    <li className="text-navbar-gray hover:text-blue cursor-pointer">
                      <Link to="/token-transfer">TRANSFER</Link>
                    </li>
                    <li className="text-navbar-gray hover:text-blue cursor-pointer">
                      <Link to="/burn-mint-token">MINT & BURN</Link>
                    </li>
                    <li className="text-navbar-gray hover:text-blue cursor-pointer">
                      <Link to="/freeze-account">FREEZE ACCOUNT</Link>
                    </li>
                    <li className="text-navbar-gray hover:text-blue cursor-pointer">
                      <Link to="/close-account">CLOSE ACCOUNT</Link>
                    </li>
                    <li className="text-navbar-gray hover:text-blue cursor-pointer">
                      <Link to="/multisignature">MULTISIGNATURE</Link>
                    </li>
                    <li className="text-navbar-gray hover:text-blue cursor-pointer">
                      <Link to="/airdrop">FAUCET</Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>
            <li className="relative group">
              <div onMouseEnter={handleTokenomicsHover} className="px-3 py-2 rounded cursor-pointer text-navbar-gray hover:text-blue">
                TOKENOMICS
              </div>
              {isTokenomicsHovered && (
                <div ref={tokenomicsModalRef} className="absolute left-0 mt-1 w-40 bg-white p-4 rounded shadow-md">
                  <ul className="space-y-2">
                    <li className="text-navbar-gray hover:text-blue cursor-pointer">
                      <Link to="/tokenomics">CREATE TOKENOMICS</Link>
                    </li>
                    <li className="text-navbar-gray hover:text-blue cursor-pointer">
                      <Link to="/vesting-list">MANAGE TOKENOMICS</Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>
            <li className="relative group">
              <div onMouseEnter={handleStakeHover} className="px-3 py-2 rounded cursor-pointer text-navbar-gray hover:text-blue">
                <Link to="/stake">STAKE</Link>
              </div>
            </li>
            <li>
              <ConnectButton />
            </li>
          </ul>
        </div>
        <div className={`lg:hidden`}>
          <button onClick={toggleMenu} className="text-blue hover:text-blue-dark focus:outline-none">
            <FiMenu className="w-6 h-6" />
          </button>
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
                {/* Diğer menü öğelerini ekleyin */}
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopBar;
