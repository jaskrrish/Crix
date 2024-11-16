import { useAccount, useReadContract } from "wagmi";
import RedeemBtn from "../components/RedeemBtn";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../config";
import { Web3 } from "web3";

const YourBet = () => {
  const account = useAccount();

  const { data: bets, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getBetsByAddress",
    args: [account.address],
    watch: true,
  });

  return (
    <div className="h-[500px] overflow-auto">
      <table className="min-w-full table-auto bg-black text-white">
        <thead className="sticky top-0 bg-black">
          <tr className="border-b border-gray-600">
            <th className="px-6 py-2">Status</th>
            <th className="px-6 py-2">Over</th>
            <th className="px-6 py-2">Ball Number</th>
            <th className="px-6 py-2">Prediction</th>
            <th className="px-6 py-2">Zone</th>
            <th className="px-6 py-2">Option</th>
            <th className="px-6 py-2">Bet Amount</th>
            <th className="px-6 py-2">Reward</th>
            <th className="px-6 py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-700">
          {isLoading ? (
            <tr>
              <td colSpan="9" className="text-center py-4">
                Loading your bets...
              </td>
            </tr>
          ) : bets && bets.length > 0 ? (
            bets.map((bet, index) => (
              <tr
                key={index}
                className="bg-gray-800 border-b border-gray-600 hover:bg-gray-750"
              >
                <td className="px-6 py-2">
                  <span
                    className={`px-2 py-1 rounded ${
                      bet.isWon ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    {bet.isWon ? "Won" : "Pending"}
                  </span>
                </td>
                <td className="px-6 py-2">{Number(bet.betOver)}</td>
                <td className="px-6 py-2">{Number(bet.betBallNumber)}</td>
                <td className="px-6 py-2">
                  {Number(bet.betPrediction) === 10
                    ? "W"
                    : Number(bet.betPrediction)}
                </td>
                <td className="px-6 py-2">{Number(bet.betZone)}</td>
                <td className="px-6 py-2">{Number(bet.betOption)}</td>
                <td className="px-6 py-2">
                  {Web3.utils.fromWei(bet.betAmount.toString(), "ether")} CRX
                </td>
                <td className="px-6 py-2">
                  {bet.reward && Number(bet.reward) > 0
                    ? `${Web3.utils.fromWei(
                        bet.reward.toString(),
                        "ether"
                      )} CRX`
                    : "-"}
                </td>
                <td className="px-6 py-2">
                  <RedeemBtn
                    betId={bet.betId}
                    isWon={bet.isWon}
                    reward={bet.reward}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center py-4">
                No bets found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default YourBet;
