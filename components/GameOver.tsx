import React from "react";
import { FinalScore } from "../utils/tsTypes";

const GameOver = ({ sortedPlayerList }: { sortedPlayerList: FinalScore[] }) => {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-50 backdrop-blur-md flex items-center justify-center">
      <h1 className="md:text-7xl text-4xl  font-bold text-center text-gray-700">
        Game Over
      </h1>
      <div className="w-[300px] flex flex-col gap-3 p-5 rounded-lg bg-white/60 backdrop-blur-lg shadow-lg">
        {sortedPlayerList.map((player, index) => {
          return (
            <div
              key={index}
              className="bg-white/70 rounded-md p-2 text-neutral-800 flex justify-between items-center shadow-sm"
            >
              <span>
                {index + 1}. {player.name}
              </span>
              <span>{player.totalScore}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameOver;
