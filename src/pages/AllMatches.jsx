import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AllMatches() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch(
      "https://api.cricapi.com/v1/series_info?apikey=e7ebe5f5-b5c9-4f87-8a1f-925d47378409&id=76ae85e2-88e5-4e99-83e4-5f352108aebc"
    )
      .then((response) => response.json())
      .then((data) => setMatches(data.data.matchList));
  }, []);

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-500">
        Cricket Betting
      </h1>

      {/* Random Generated Data Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-500">
          Play on Random Generated Data
        </h2>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h3 className="text-xl font-semibold mb-2 text-purple-400">
            How We Generate Randomness
          </h3>
          <p className="text-gray-300">
            We use the Pyth Network to ensure fair and unpredictable outcomes in
            our randomly generated matches. Pyth is a decentralized oracle
            network that provides high-fidelity financial market data, which we
            leverage to create truly random and unbiased match scenarios.
          </p>
        </div>
        <Link
          to="/match"
          className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          Play Random Match
        </Link>
      </section>

      {/* Live Matches Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-yellow-500">
          Play on Live Matches
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match, index) => (
            <Link to={`/match/${match.id}`} key={index}>
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition duration-300">
                <h3 className="text-xl mb-2 text-purple-400">{match.name}</h3>
                <p className="text-gray-300">
                  <strong>Type:</strong> {match.matchType}
                </p>
                <p className="text-gray-300">
                  <strong>Status:</strong> {match.status}
                </p>
                <p className="text-gray-300">
                  <strong>Venue:</strong> {match.venue}
                </p>
                <p className="text-gray-300">
                  <strong>Date:</strong> {match.date}
                </p>
                <div className="flex mt-4">
                  {match.teamInfo.map((team, index) => (
                    <div key={index} className="mr-4 text-center">
                      <img
                        src={team.img}
                        alt={team.name}
                        className="w-12 h-12 mx-auto rounded-full"
                      />
                      <p className="text-green-400 mt-2">{team.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AllMatches;
