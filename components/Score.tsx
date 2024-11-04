import React from "react";

const Score = ({ players }) => {
  return (
    <main className="absolute inset-0 bg-black bg-opacity-50 flex justify-between items-center">
      <div className="flex flex-col gap-5">
        {players &&
          players.map((player) => {
            return (
              <div key={player.socketId} className="flex gap-2 items-center">
                <div className="">
                  <p className="text-sm font-bold">
                    {player.name} :{player.score}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
};

export default Score;
