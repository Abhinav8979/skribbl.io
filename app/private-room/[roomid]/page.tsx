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
import { Player } from "../../../utils/tsTypes";
import GenerateAvatar from "../../../utils/GenerateAvatar";

export default function Page() {
  const play = useAppSelector((state) => state.other.Play);

  const players = useAppSelector((state) => state.game.players) as Player[];

  const isPlayerChoosingWord = useAppSelector(
    (state) => state.other.isPlayerchoosingWord
  );
  const index = useAppSelector((state) => state.other.playerIndex);
  const isplayerturn = useAppSelector((state) => state.other.isPlayerTurn);
  const showRoundScore = useAppSelector((state) => state.other.showScore);
  const wordCount = useAppSelector((state) => state.gameSetting.wordCount);

  const [wordsList, SetWordsList] = useState<string[]>([]);
  const socket = getSocket();
  const { roomid } = useParams();

  const dispatch = useAppDispatch();

  useEffect(() => {
    SetWordsList(generateRandomWords(wordCount));
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
      {!play ? <GameSetting players={players} /> : <PlayerDrawingBoard />}
      {play && !showRoundScore && isPlayerChoosingWord && (
        <div
          className="flex justify-center items-center absolute w-full md:h-[565px] h-screen inset-0"
          style={{
            pointerEvents: isPlayerChoosingWord ? "auto" : "none",
          }}
        >
          <div className="absolute bg-black opacity-85 inset-0 z-20"></div>
          <div className="z-[21]">
            <div>
              <div className="md:text-6xl text-3xl absolute top-20 left-1/2 -translate-x-1/2">
                <Timer startTime={10} onTimeUp={handleTimeUp} />
              </div>
              <h1 className="md:text-4xl text-xl">
                {isplayerturn
                  ? "Choose"
                  : players[index]?.name + " is choosing"}{" "}
                a word!
              </h1>
              <div className="flex md:gap-10 gap-7 mt-7">
                {isplayerturn &&
                  wordsList.map((word: string, index) => (
                    <button
                      key={index}
                      onClick={() => handleClick(word)}
                      className="p-2 bg-white text-black rounded-custom md:text-base text-sm"
                    >
                      {word}
                    </button>
                  ))}
              </div>
              {isPlayerChoosingWord && (
                <div
                  className={`w-[120px] h-[120px] overflow-hidden mx-auto relative md:scale-[.6]  scale-[.4] items-center `}
                >
                  <GenerateAvatar
                    eye={players[index]?.avatar?.[0]}
                    mouth={players[index]?.avatar?.[1]}
                    face={players[index]?.avatar?.[2]}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
