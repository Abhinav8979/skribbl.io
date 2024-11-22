import React from "react";
import { FinalScore } from "../utils/tsTypes";

const GameOver = ({ sortedPlayerList }: { sortedPlayerList: FinalScore[] }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center">
      <h1 className="md:text-7xl text-4xl font-bold text-center text-white">
        Game Over
      </h1>
      <div className="w-full max-w-[400px] flex flex-col gap-6 p-6 rounded-lg bg-white/80 backdrop-blur-lg shadow-xl mt-8">
        {sortedPlayerList.map((player, index) => {
          return (
            <div
              key={index}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md p-4 text-lg font-medium flex justify-between items-center shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-2xl"
            >
              <span className="font-semibold">
                {index + 1}. {player.name}
              </span>
              <span className="font-bold text-xl">{player.totalScore}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameOver;
