import React from "react";
import Timer from "../utils/Timer";
import {
  setNextRound,
  setPlayerIndex,
  setWord,
  showScore,
} from "../redux/actions/allActions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getSocket } from "../app/socket";
import { useParams } from "next/navigation";

const Score = ({ players }) => {
  const dispatch = useAppDispatch();
  const totalRounds = useAppSelector((state) => state.gameSetting.rounds);
  const socket = getSocket();
  const { roomid } = useParams();

  const handleTimeUp = () => {
    dispatch(showScore(false));
    dispatch(setWord(""));
    let index;
    dispatch((dispatch, getState) => {
      index = getState().other.playerIndex;
      if (index + 1 >= players.length) {
        dispatch(setPlayerIndex(0));
        dispatch((dispatch, getState) => {
          const nextRound = getState().game.currentRound;
          if (nextRound !== totalRounds) {
            dispatch(setNextRound(nextRound + 1));
            return;
          } else {
            // dispatch(gameOver(true);)
            alert("game over");
          }
        });
      } else {
        dispatch(setPlayerIndex(index + 1));
      }
    });
    socket.emit("game:next-round", roomid);
  };

  return (
    <main className="absolute inset-0 bg-black bg-opacity-80 flex justify-center items-center">
      <div className="flex flex-col gap-5 items-center justify-center bg-gray-300 w-[300px]">
        <div className="text-lg">
          {<Timer startTime={7} onTimeUp={handleTimeUp} />}
        </div>
        {players &&
          players.map((player) => {
            return (
              <div key={player.socketId} className="flex items-center text-2xl">
                <p className="font-bold">
                  {player.name} :{player.score ? player.score : 0}
                </p>
              </div>
            );
          })}
      </div>
    </main>
  );
};

export default Score;
