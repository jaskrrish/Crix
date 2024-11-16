import React, { useState, useRef, useEffect } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../config";
import { dataEventEmitter, getGeneratedBetId } from "../data";
import MintRedeemInterface from "../components/MintRedeemInterface";
import YourBet from "../components/YourBet";
import MatchCard from "../components/MatchCard";

const TabButton = ({ icon, title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center space-x-2 w-full py-2.5 text-sm font-medium leading-5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white
      ${
        isActive
          ? "bg-purple-700 shadow"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
  >
    {icon}
    <span>{title}</span>
  </button>
);

export default function MatchAndBet() {
  const [currentValues, setCurrentValues] = useState({
    currentBetId: getGeneratedBetId(),
    currentBall: 0,
    currentOver: 0,
  });
  const [betAmount, setBetAmount] = useState("");
  const [activeTab, setActiveTab] = useState("bet");
  const { writeContract, error, status } = useWriteContract();

  const totalBets = useReadContract({
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "totalBets",
  });

  const predictions = [4, 6, 10]; // 10 represents Wicket
  const zones = Array.from({ length: 14 }, (_, i) => i + 1);

  let optId = 1;
  const predictionZoneMap = [];

  for (let prediction of predictions) {
    for (let zone of zones) {
      predictionZoneMap.push({
        optId: optId++,
        prediction,
        zone,
      });
    }
  }

  const predictionRef = useRef();
  const zoneRef = useRef();

  useEffect(() => {
    const handleUpdate = ({ generatedBetId, generatedBall, generatedOver }) => {
      setCurrentValues({
        currentBetId: generatedBetId,
        currentBall: generatedBall,
        currentOver: generatedOver,
      });
    };

    dataEventEmitter.on("update", handleUpdate);
    return () => dataEventEmitter.off("update", handleUpdate);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const betAmountInWei = Web3.utils.toBigInt(betAmount);
    const selectedPrediction =
      predictionRef.current.value === "W"
        ? 10
        : parseInt(predictionRef.current.value);
    const selectedZone = parseInt(zoneRef.current.value);
    const selectedOption = predictionZoneMap.find(
      (option) =>
        option.prediction === selectedPrediction && option.zone === selectedZone
    );

    if (selectedOption) {
      if (error) {
        alert(error.cause.reason);
      }

      console.log(`BetId for bet : ${getGeneratedBetId()}`);

      writeContract({
        abi: CONTRACT_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "bet",
        args: [
          betAmountInWei,
          getGeneratedBetId(),
          selectedOption.optId,
          selectedZone,
          currentValues.currentOver,
          currentValues.currentBall,
          selectedPrediction,
        ],
      });
    } else {
      alert("Options not selected");
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-900 text-white overflow-hidden">
      <div className="w-[45%] p-4 overflow-y-auto">
        <MatchCard />
      </div>
      <div className="w-[55%] p-4 overflow-y-auto">
        <div className="flex space-x-1 rounded-xl bg-gray-800 p-1 mb-4">
          <TabButton
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            title="Swap Coins"
            isActive={activeTab === "swap"}
            onClick={() => setActiveTab("swap")}
          />
          <TabButton
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
            title="Place a Bet"
            isActive={activeTab === "bet"}
            onClick={() => setActiveTab("bet")}
          />
          <TabButton
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            }
            title="My Bets"
            isActive={activeTab === "mybets"}
            onClick={() => setActiveTab("mybets")}
          />
        </div>
        <div className="mt-4">
          {activeTab === "swap" && <MintRedeemInterface />}
          {activeTab === "bet" && (
            <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
              <img
                src="./zones.png"
                alt="Zones"
                className="mx-auto h-[18rem] mb-5 rounded-lg"
              />
              {error && (
                <div className="bg-red-500 text-white p-3 rounded-md mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="prediction"
                      className="block text-sm font-medium mb-1"
                    >
                      Prediction
                    </label>
                    <select
                      ref={predictionRef}
                      id="prediction"
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      <option value="">Select Prediction</option>
                      <option value="4">Four</option>
                      <option value="6">Six</option>
                      <option value="W">Wicket</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="zone"
                      className="block text-sm font-medium mb-1"
                    >
                      Zone
                    </label>
                    <select
                      ref={zoneRef}
                      id="zone"
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      <option value="">Select Zone</option>
                      {zones.map((zone) => (
                        <option key={zone} value={zone}>
                          Zone {zone}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="betAmount"
                    className="block text-sm font-medium mb-1"
                  >
                    Bet Amount (CRX)
                  </label>
                  <input
                    id="betAmount"
                    type="number"
                    step="0.000000000000000001"
                    min="0"
                    placeholder="Amount of CRX to bet"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "pending"}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "pending" ? "PLACING BET..." : "PLACE BET"}
                </button>
              </form>
            </div>
          )}
          {activeTab === "mybets" && <YourBet />}
        </div>
      </div>
    </div>
  );
}
