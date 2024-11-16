import { useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../config";

const RedeemBtn = ({ betId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { writeContract, error, status } = useWriteContract();

  const { data: canWithdraw } = useReadContract({
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "canWithdrawTokens",
    args: [betId],
  });

  const handleRedeem = async () => {
    setIsLoading(true);
    try {
      writeContract({
        abi: CONTRACT_ABI,
        address: CONTRACT_ADDRESS,
        functionName: "resolveBet",
        args: [betId],
      });
    } catch (err) {
      console.error("Redeem failed:", err);
      alert("Failed to redeem. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "success") {
      alert("Redeem Successful! Your tokens have been transferred.");
    } else if (status === "error" && error) {
      alert(`Redeem failed: ${error.message || "Unknown error"}`);
    }
  }, [status, error]);

  return (
    <button
      disabled={!canWithdraw || isLoading}
      onClick={handleRedeem}
      className={`
        px-4 py-2 rounded-full
        ${
          !canWithdraw || isLoading
            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
        }
        font-semibold text-sm
        transition-all duration-300 ease-in-out
        transform hover:scale-105 active:scale-95
        shadow-md hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
      `}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          Redeem
        </>
      )}
    </button>
  );
};

export default RedeemBtn;
