import React, { useState, useRef, useEffect } from "react";
import MatchCard from "../components/MatchCard";
import MintRedeemInterface from "../components/MintRedeemInterface";
import { useReadContract, useWriteContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../config";
import Web3 from "web3";
import YourBet from "../components/YourBet";
import { dataEventEmitter, getGeneratedBetId } from "../data";

const TabButton = ({ title, selectedTab, setSelectedTab, tabName }) => (
  <div
    className="w-[33%] rounded-md p-1 cursor-pointer"
    onClick={() => setSelectedTab(tabName)}
  >
    <p
      className={`text-center text-pink-200 ${
        selectedTab === tabName ? "bg-purple-800" : ""
      } rounded-md py-2 transition-colors duration-200`}
    >
      {title}
    </p>
  </div>
);

const MatchBet = () => {
  const [currentValues, setCurrentValues] = useState({
    currentBetId: getGeneratedBetId(),
    currentBall: 0,
    currentOver: 0,
  });
  const [selectedTab, setSelectedTab] = useState("Next Bet");
  const [betAmount, setBetAmount] = useState();
  const { writeContract, error, status } = useWriteContract();

  const totalBets = useReadContract({
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "totalBets",
  });

  const predictions = [4, 6, 10];
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

  console.log("Predictions", predictionZoneMap);

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

    return () => {
      dataEventEmitter.off("update", handleUpdate);
    };
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
    <div className="flex w-full h-[95vh] py-8 bg-gradient-to-br from-purple-950 to-pink-950">
      <div className="w-[45%] h-full overflow-y-auto">
        <MatchCard />
      </div>
      <div className="w-[55%] h-full pr-3 overflow-y-auto">
        <div className="flex w-full bg-purple-950 mb-5 rounded-md p-1">
          <TabButton
            title="Swap Coins"
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tabName="Mint CRC"
          />

          <TabButton
            title="Place a Bet"
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tabName="Next Bet"
          />

          <TabButton
            title="My Bets"
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tabName="Your Bet"
          />
        </div>
        {selectedTab === "Mint CRC" && <MintRedeemInterface />}

        {selectedTab === "Next Bet" && (
          <div className="h-full bg-purple-900 bg-opacity-50 text-pink-100 p-5 rounded-md">
            <img
              src={"./zones.png"}
              alt="Zones"
              className="mx-auto h-80 mb-5 rounded-lg shadow-lg"
            />
            <form
              className="space-y-4 bg-purple-800 bg-opacity-50 p-6 rounded-lg shadow-lg"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="prediction"
                    className="block text-sm font-medium text-pink-200"
                  >
                    Prediction
                  </label>
                  <select
                    ref={predictionRef}
                    id="prediction"
                    required
                    className="mt-1 block w-full py-2 px-3 border border-pink-500 bg-purple-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-pink-100"
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
                    className="block text-sm font-medium text-pink-200"
                  >
                    Zone
                  </label>
                  <select
                    ref={zoneRef}
                    id="zone"
                    required
                    className="mt-1 block w-full py-2 px-3 border border-pink-500 bg-purple-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-pink-100"
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
                  className="block text-sm font-medium text-pink-200"
                >
                  Bet Amount
                </label>
                <input
                  id="betAmount"
                  placeholder="Amount of CRC to bet"
                  type="number"
                  className="mt-1 block w-full py-2 px-3 border border-pink-500 bg-purple-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-pink-100"
                  onChange={(e) => setBetAmount(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full mt-1 font-bold px-4 py-2 border border-transparent text-sm tracking-wider rounded-md text-purple-900 bg-pink-400 hover:bg-pink-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200"
                >
                  PLACE BET
                </button>
              </div>
            </form>
          </div>
        )}
        {selectedTab === "Your Bet" && <YourBet />}
      </div>
    </div>
  );
};

export default MatchBet;
