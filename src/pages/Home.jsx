import React from "react";
import { Link } from "react-router-dom";
import { background, oneStep, twoStep, threeStep } from "../assets";

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full text-white min-h-screen bg-gray-900">
      <div
        className="w-full py-32 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            A prediction based cricket game
          </h1>
          <p className="mt-8 text-2xl md:text-3xl font-semibold text-gray-300 mb-12">
            Earn crypto rewards for correct predictions
          </p>
          <Link
            to="/play"
            className="px-8 py-4 text-xl font-bold bg-purple-600 hover:bg-purple-700 transition-colors duration-300 rounded-full inline-block"
          >
            Start Playing
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl mb-16">
          <h2 className="text-3xl font-bold mb-6 text-purple-400">About Us</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            CriX is a decentralized cricket betting platform where you can guess
            the game and win real rewards. Dive into the excitement of cricket
            betting with our unique NFT-based game prediction system based on
            events taking place on particular portions of a cricket stadium.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6 text-purple-400">
            Steps To Play
          </h2>
          <p className="text-2xl font-mono mb-2 text-gray-300">
            USING OUR PLATFORM TO PLACE PREDICTIONS
          </p>
          <p className="text-gray-400 mb-8">IS AS EASY AS 1-2-3</p>

          <div className="space-y-12">
            {[
              {
                img: oneStep,
                text: "Guess the Game: Buy NFTs representing different parts of the cricket ground and predict the outcome of the next ball, boundary, or six.",
              },
              {
                img: twoStep,
                text: "Earn Rewards: Win cryptocurrency rewards for accurate predictions and participation in contests.",
              },
              {
                img: threeStep,
                text: "Fair and Transparent: Enjoy transparency and fairness ensured by blockchain technology, providing a level playing field for all participants.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="flex items-start space-x-6 bg-gray-800 p-6 rounded-2xl"
              >
                <img
                  src={step.img}
                  alt={`Step ${index + 1}`}
                  className="w-16 h-16 object-contain"
                />
                <p className="text-xl text-gray-300 flex-1">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
