import React from "react";
import Timer from "../utils/Timer";
import {
  setNextRound,
  setPlayerIndex,
  setWord,
} from "../redux/actions/allActions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updatePlayerScore } from "../redux/features/game/game";

const Score = ({ players }) => {
  const dispatch = useAppDispatch();
  const totalRounds = useAppSelector((state) => state.gameSetting.rounds);

  const handleTimeUp = () => {
    dispatch(setWord(""));
    let index;
    dispatch((dispatch, getState) => {
      index = getState().other.playerIndex;

      if (index + 1 > players.length) {
        index = 0;
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
      }
      dispatch(setPlayerIndex(index + 1));
    });
  };

  return (
    <main className="absolute inset-0 bg-black bg-opacity-50 flex justify-between items-center">
      <div className="flex flex-col gap-5 items-center justify-center">
        <div>{<Timer startTime={7} onTimeUp={handleTimeUp} />}</div>
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
