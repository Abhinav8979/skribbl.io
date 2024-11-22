import React from "react";
import Timer from "../utils/Timer";
import { showScore } from "../redux/actions/allActions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getSocket } from "../app/socket";
import { useParams } from "next/navigation";
import { ScoreProps } from "../utils/tsTypes";
import { resetPlayerScore } from "../redux/features/game/game";

const Score: React.FC<ScoreProps> = ({ players }) => {
  const dispatch = useAppDispatch();
  const socket = getSocket();
  const { roomid } = useParams();

  const handleTimeUp = () => {
    dispatch(showScore(false));
    dispatch(resetPlayerScore());
    socket.emit("game:next-round", roomid);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <div className="bg-white/80 rounded-lg px-6 py-8 w-full max-w-lg text-center text-textPrimary shadow-xl">
        <div className="text-lg text-gray-800 font-semibold p-2 bg-white/40 rounded-lg shadow-inner w-full text-center">
          <Timer startTime={7} onTimeUp={handleTimeUp} />
        </div>

        <h2 className="text-xl font-bold text-gray-700 mt-6">Players</h2>

        <div className="flex flex-col gap-6 w-full mt-6">
          {players &&
            players.map((player) => (
              <div
                key={player.socketId}
                className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-medium p-5 rounded-lg shadow-xl border-2 border-white/30 transform transition-transform duration-200 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-700"
              >
                <p className="font-semibold text-sm md:text-base">
                  {player.name}
                </p>
                <p className="font-bold text-lg md:text-xl">
                  {player.score ? player.score : 0}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Score;
