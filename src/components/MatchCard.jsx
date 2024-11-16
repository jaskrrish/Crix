import { useEffect, useState } from "react";
import { response } from "../data";

export default function MatchCard() {
  const [score, setScore] = useState("0/0");
  const [ballsLeft, setBallsLeft] = useState(62);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= response.length) {
        clearInterval(interval);
        return;
      }

      if (response[i]) {
        setScore(response[i].score);
        setBallsLeft((prevBalls) => prevBalls - 1);
      }

      i += 1;
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg max-w-md mx-auto">
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
            LIVE
          </div>
          <div className="text-white text-sm">Match 23 (Wankhede Stadium)</div>
        </div>
        <div className="flex justify-between items-center text-white">
          <div className="text-center">
            <div className="text-3xl font-bold">MI</div>
            <div className="text-4xl font-bold mt-2">{score}</div>
            <div className="text-sm mt-1">9.4/20</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">VS</div>
            <div className="text-sm">
              Need{" "}
              {response[0]?.team1 && score
                ? Number(response[0].team1.split("/")[0]) -
                  Number(score.split("/")[0])
                : ""}{" "}
              runs
            </div>
            <div className="text-sm mt-1">{ballsLeft} balls left</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">GT</div>
            <div className="text-4xl font-bold mt-2">201/8</div>
            <div className="text-sm mt-1">20/20</div>
          </div>
        </div>
      </div>
      <div className="p-4 bg-gray-900">
        <div className="flex justify-between text-gray-300 mb-4">
          <div>
            <div className="font-semibold">Hardik Pandya*</div>
            <div className="text-sm">(32/22)</div>
          </div>
          <div className="text-right">
            <div className="font-semibold">Rohit Sharma</div>
            <div className="text-sm">(45/21)</div>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-bold text-center text-purple-400 mb-2">
            Commentary
          </h3>
          <p className="text-sm text-gray-300 bg-gray-800 p-3 rounded-lg">
            In an electrifying IPL clash, Bumrah&apos;s fiery delivery outfoxed
            Dhoni, taking a slight edge. SKY, at slip, leapt with grace,
            snagging the ball magnificently. The stadium erupted as this iconic
            MI vs CSK moment unfolded, showcasing skill and intense rivalry in a
            heartbeat.
          </p>
        </div>
      </div>
      <div className="bg-gray-800 p-4">
        <div className="text-center text-sm text-gray-400">
          Target:{" "}
          {response[0]?.team1
            ? Number(response[0].team1.split("/")[0]) + 1
            : ""}
        </div>
      </div>
    </div>
  );
}
