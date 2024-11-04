"use client";

import { useEffect, useState } from "react";
import PlayerDrawingBoard from "../../../components/drawing canvas/PlayerDrawingBoard";
import GameSetting from "../../../components/GameSetting";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import Timer from "../../../utils/Timer";
import { generateRandomWords } from "../../../utils/utils";
import {
  setIsPlayerChoosingWord,
  setWord,
} from "../../../redux/actions/allActions";
import { getSocket } from "../../socket";
import { useParams } from "next/navigation";

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
  const isplayerturn = useAppSelector((state) => state.other.isPlayerTurn);

  const [wordsList, SetWordsList] = useState<string[]>([]);
  const socket = getSocket();
  const { roomid } = useParams();

  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(setIsPlayerChoosingWord(false));
  // }, []);

  useEffect(() => {
    SetWordsList(generateRandomWords());
  }, [index]);

  const handleTimeUp = () => {
    const randomWord = wordsList[Math.floor(Math.random() * wordsList.length)];
    dispatch(setWord(randomWord));
    dispatch(setIsPlayerChoosingWord(false));
    socket.emit("game:word", { roomid, word: randomWord });
  };

  const handleClick = (word: string) => {
    dispatch(setWord(word));
    dispatch(setIsPlayerChoosingWord(false));
    socket.emit("game:word", { roomid, word });
  };

  return (
    <section className="relative">
      {!play ? <GameSetting /> : <PlayerDrawingBoard />}
      {play && isPlayerChoosingWord && (
        <div
          className="flex justify-center items-center absolute w-full h-[565px] inset-0"
          style={{
            pointerEvents: isPlayerChoosingWord ? "auto" : "none",
          }}
        >
          <div className="absolute bg-black opacity-85 inset-0 z-20"></div>
          <div className="z-[21]">
            <div>
              <div className="text-6xl absolute top-20 left-1/2 -translate-x-1/2">
                <Timer startTime={10} onTimeUp={handleTimeUp} />
              </div>
              <h1 className="text-4xl">
                {isplayerturn
                  ? "Choose"
                  : players[index]?.name + " is choosing"}{" "}
                a word!
              </h1>
              <div className="flex gap-10 mt-7">
                {isplayerturn &&
                  wordsList.map((word: string) => (
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
