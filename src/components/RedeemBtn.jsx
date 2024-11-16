import { useEffect } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../config";

const RedeemBtn = ({ betId, isWon, reward }) => {
  const { writeContract, error, status, isLoading } = useWriteContract();

  const { data: canWithdraw } = useReadContract({
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "canWithdrawTokens",
    args: [betId],
    watch: true,
  });

  const handleRedeem = async () => {
    try {
      writeContract({
        abi: CONTRACT_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "resolveBet",
        args: [betId],
      });
    } catch (err) {
      alert(err.message || "Transaction failed");
    }
  };

  useEffect(() => {
    if (status === "success") {
      alert("Redeem successful! Your tokens have been transferred.");
    } else if (status === "error" && error) {
      alert(`Redeem failed: ${error.message || "Unknown error"}`);
    }
  }, [status, error]);

  // Don't show button if bet isn't won or has no reward
  if (!isWon || !reward || Number(reward) === 0) {
    return null;
  }

  return (
    <button
      onClick={handleRedeem}
      disabled={!canWithdraw || isLoading}
      className={`
                px-4 py-2 rounded
                ${isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"}
                text-white font-medium
                transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
            `}
    >
      {isLoading ? (
        <>
          <span className="animate-spin">↻</span>
          Processing...
        </>
      ) : (
        "Redeem"
      )}
    </button>
  );
};

export default RedeemBtn;
