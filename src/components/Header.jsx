import React from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract, useAccount } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../config.js";

const Header = () => {
  const account = useAccount();
  const CRXBalance = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "balanceOf",
    args: [account.address],
  });

  const balance = CRXBalance.data ? Number(CRXBalance.data) : 0;

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900 to-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3">
            <img src="./crc.png" alt="Cryck Logo" className="h-12 w-auto" />
            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              CriX
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-4 text-gray-300">
              <Link
                to="/play"
                className="hover:text-white transition-colors duration-200"
              >
                Matches
              </Link>
              <Link
                to="/leaderboard"
                className="hover:text-white transition-colors duration-200"
              >
                Leaderboard
              </Link>
              <Link
                to="/faq"
                className="hover:text-white transition-colors duration-200"
              >
                FAQ
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ConnectButton />
              <div className="flex items-center space-x-2 bg-gray-800 rounded-full px-4 py-2">
                <span className="text-white font-medium">{balance}</span>
                <img src="./crc.png" alt="CRX" className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
