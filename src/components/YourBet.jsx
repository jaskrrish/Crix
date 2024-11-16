import { useAccount, useReadContract } from "wagmi";
import RedeemBtn from "../components/RedeemBtn";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../config";

const YourBet = () => {
  const account = useAccount();

  const { data } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getBetsByAddress",
    args: [account.address],
  });

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Your Bets</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-700 text-gray-400">
              <tr>
                <th className="px-6 py-3">Over</th>
                <th className="px-6 py-3">Ball</th>
                <th className="px-6 py-3">Prediction</th>
                <th className="px-6 py-3">Zone</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((bet, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-700 hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">
                      {Number(bet.betOver)}
                    </td>
                    <td className="px-6 py-4">{Number(bet.betBallNumber)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold
                                            ${
                                              Number(bet.betPrediction) === 10
                                                ? "bg-red-600 text-white"
                                                : Number(bet.betPrediction) ===
                                                  6
                                                ? "bg-green-600 text-white"
                                                : "bg-blue-600 text-white"
                                            }`}
                      >
                        {Number(bet.betPrediction) === 10
                          ? "W"
                          : Number(bet.betPrediction)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{Number(bet.betZone)}</td>
                    <td className="px-6 py-4">{Number(bet.betAmount)} CRX</td>
                    <td className="px-6 py-4">
                      <RedeemBtn betId={bet.betId} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {(!data || data.length === 0) && (
          <div className="text-center py-8 text-gray-400">
            No bets placed yet. Start betting to see your history here!
          </div>
        )}
      </div>
    </div>
  );
};

export default YourBet;
