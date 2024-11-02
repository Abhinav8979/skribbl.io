"use client";

import { useEffect, useState } from "react";
import PlayerDrawingBoard from "../../../components/drawing canvas/PlayerDrawingBoard";
import GameSetting from "../../../components/GameSetting";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import Timer from "../../../utils/Timer";
import { generateRandomWords } from "../../../utils/utils";
import {
  setIsPlayerChoosingWord,
  setIsPlayerTURN,
  setWord,
} from "../../../redux/actions/allActions";
import { getSocket } from "../../socket";

interface Player {
  socketId: string;
}

export default function Page() {
  const play = useAppSelector((state) => state.other.Play);

  const players = useAppSelector((state) => state.game.players) as Player[];

  const isPlayerChoosingWord = useAppSelector(
    (state) => state.other.isPlayerchoosingWord
  );
  const index = useAppSelector((state) => state.other.playerIndex);

  const [wordsList, SetWordsList] = useState<string[]>([]);
  const [showTimer, setShowTimer] = useState<boolean>(true);
  const socket = getSocket();

  const dispatch = useAppDispatch();

  useEffect(() => {
    SetWordsList(generateRandomWords());

    if (index >= 0 && index < players.length) {
      const isCurrentPlayerChoosingWord = players[index].socketId === socket.id;
      dispatch(setIsPlayerChoosingWord(isCurrentPlayerChoosingWord));
    }
  }, [dispatch, players, index, socket]);

  const handleTimeUp = () => {
    const randomWord = wordsList[Math.floor(Math.random() * wordsList.length)];
    setShowTimer(false);
    dispatch(setWord(randomWord));
    dispatch(setIsPlayerTURN(true));
    dispatch(setIsPlayerChoosingWord(false));
  };

  const handleClick = (word: string) => {
    setShowTimer(false);
    dispatch(setWord(word));
    dispatch(setIsPlayerTURN(true));
    dispatch(setIsPlayerChoosingWord(false));
  };

  return (
    <section className="relative">
      {!play ? <GameSetting /> : <PlayerDrawingBoard />}
      {play && isPlayerChoosingWord && (
        <div className="flex justify-center items-center absolute w-full h-[565px] inset-0">
          <div className="absolute bg-black opacity-85 inset-0 z-20"></div>
          <div className="z-[21]">
            <div>
              {showTimer && (
                <div className="text-6xl absolute top-20 left-1/2 -translate-x-1/2">
                  <Timer startTime={10} onTimeUp={handleTimeUp} />
                </div>
              )}
              <h1 className="text-4xl">Choose a word!</h1>
              <div className="flex gap-10 mt-7">
                {wordsList.map((word: string) => (
                  <button
                    key={word}
                    onClick={() => handleClick(word)}
                    className="p-2 bg-white text-black rounded-custom"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
