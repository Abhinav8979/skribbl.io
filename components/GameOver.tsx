"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { Player } from "../utils/tsTypes";

const GameOver = () => {
  const players: Player[] = useAppSelector((state) => state.game.players);

  const [playerRank, setPlayerRank] = useState<Player[]>([]);

  useEffect(() => {
    const sortedPlayerList = players.sort((a, b) => b.score - a.score);
    setPlayerRank(sortedPlayerList);
  }, []);

  return (
    <div className="absolute inset-0 bg-white bg-opacity-50 backdrop-blur-md flex items-center justify-center">
      <div className="w-[300px] flex flex-col gap-3 p-5 rounded-lg bg-white/60 backdrop-blur-lg shadow-lg">
        {playerRank.map((player, index) => {
          return (
            <div
              key={index}
              className="bg-white/70 rounded-md p-2 text-neutral-800 flex justify-between items-center shadow-sm"
            >
              <span>
                {index + 1}. {player.name}
              </span>
              <span>{player.score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameOver;
