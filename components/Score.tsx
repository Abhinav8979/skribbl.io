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
  const totalRounds = useAppSelector((state) => state.gameSetting.rounds);
  const socket = getSocket();
  const { roomid } = useParams();

  const handleTimeUp = () => {
    dispatch(showScore(false));
    dispatch(resetPlayerScore());
    socket.emit("game:next-round", roomid);
  };

  return (
    <main className="absolute inset-0 bg-gradient-to-br from-white/50 to-gray-200/50 backdrop-blur-lg flex justify-center items-center p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-6 items-center justify-center bg-white bg-opacity-30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-6 w-full sm:w-[350px] md:w-[400px] lg:w-[450px]">
        <div className="text-lg text-gray-800 font-semibold p-2 bg-white/40 rounded-lg shadow-inner w-full text-center">
          {/* Timer Component */}
          <Timer startTime={7} onTimeUp={handleTimeUp} />
        </div>

        <h2 className="text-xl font-bold text-gray-700 mt-4">Players</h2>

        <div className="flex flex-col gap-4 w-full">
          {players &&
            players.map((player) => (
              <div
                key={player.socketId}
                className="flex items-center justify-between bg-white bg-opacity-40 backdrop-blur-md text-lg text-gray-800 font-medium p-4 rounded-md shadow-md border border-white/30 transition-all duration-300 hover:shadow-xl hover:bg-white/50"
              >
                <p className="font-semibold">{player.name}</p>
                <p className="text-indigo-600 font-bold">
                  {player.score ? player.score : 0}
                </p>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
};

export default Score;
