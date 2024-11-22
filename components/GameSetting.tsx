import React, { useEffect, useState, ChangeEvent } from "react";
import { useParams } from "next/navigation";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setGameMessage, setGameSetting } from "../redux/actions/allActions";
import { getSocket } from "../app/socket";
import { Player, PlayerSetting, Setting } from "../utils/tsTypes";
import Image from "next/image";
import { FaUserPlus } from "react-icons/fa";

const GameSetting = ({ players }: { players: Player[] }) => {
  const [customWords, setCustomWords] = useState<boolean>(false);
  const [customWordInput, setCustomWordInput] = useState<string>(""); // New state for input text

  const { roomid } = useParams();
  const isOwner = useAppSelector((state) => state?.other?.roomOwner);

  const setting: Setting[] = [
    {
      name: "Players",
      options: Array.from({ length: 19 }, (_, i) => i + 2),
      currentValue: 8,
    },
    {
      name: "Language",
      options: ["English", "German", "Spanish"],
      currentValue: "English",
    },
    {
      name: "Drawtime",
      options: Array.from(
        { length: (150 - 80) / 10 + 1 },
        (_, i) => 80 + i * 10
      ),
      currentValue: 80,
    },
    {
      name: "Rounds",
      options: Array.from({ length: 19 }, (_, i) => i + 2),
      currentValue: 8,
    },
    {
      name: "GameMode",
      options: ["Normal", "Hidden", "Combination"],
      currentValue: "normal",
    },
    {
      name: "WordCount",
      options: [1, 2, 3, 4, 5],
      currentValue: 3,
    },
    {
      name: "Hints",
      options: [0, 1, 2, 3, 4, 5],
      currentValue: 2,
    },
  ];

  const dispatch = useAppDispatch();

  const [playerGameSetting, setPlayerGameSetting] = useState<PlayerSetting>({
    Players: 8,
    Drawtime: 80,
    rounds: 8,
    wordCount: 3,
    hints: 2,
    Language: "English",
    gameMode: "normal",
    wordArray: [],
  });

  useEffect(() => {
    dispatch(setGameSetting(playerGameSetting));
  }, [playerGameSetting, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    name: string
  ) => {
    const value = e.target.value;
    setPlayerGameSetting((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const socket: Socket = getSocket();

  const handleGameStart = () => {
    if (players.length >= 2) {
      socket.emit("start:game", roomid);
    } else {
      const newMessages = {
        text: "At least 2 players are needed to start the game!",
        color: "red",
      };
      dispatch((dispatch, getState) => {
        const currentMessages = getState().game.messages;
        dispatch(setGameMessage([...currentMessages, newMessages]));
      });
    }
  };

  const CopyToClipboard = () => {
    if (typeof window !== "undefined") {
      const pageUrl = window.location.origin + "/?" + roomid;
      navigator.clipboard.writeText(pageUrl).then(() => {
        socket.emit("copy:clipboard", roomid);
      });
    }
  };

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (customWords) {
      setCustomWordInput(e.target.value);
    }
  };

  return (
    <main
      style={{
        cursor: isOwner ? "default" : "not-allowed",
      }}
      className="flex md:p-2 flex-col bg-[#35394A] rounded-custom text-white relative"
    >
      {!isOwner && <div className="absolute inset-0 bg-black opacity-40"></div>}

      <div className="flex flex-wrap md:flex-col flex-row md:flex-nowrap justify-between">
        {setting.map((ele, index) => (
          <div
            key={index}
            className="flex justify-between items-center pb-1 md:w-auto w-1/2 my-[3px] gap-3"
          >
            <div className="flex items-center gap-[3px] md:gap-2">
              <Image
                src={`/gif/setting_${index}.gif`}
                alt="image"
                unoptimized
                height={30}
                width={30}
                className="md:w-[30px] md:h-[30px] h-[20px] w-[20px]"
              />
              <span className="md:text-lg text-xs font-semibold">
                {ele.name}
              </span>
            </div>
            <select
              className="bg-white text-black md:w-1/2 w-[40%]  text-xs md:text-lg sm:h-6 md:h-10 sm:p-1"
              defaultValue={ele.currentValue}
              onChange={(e) => handleChange(e, ele.name)}
            >
              {ele.options.map((option, i) => (
                <option key={i} value={option} className="sm:text-xs">
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center md:mt-4 text-xs">
        <h3 className="font-semibold md:text-lg">Custom Words</h3>
        <div className="flex items-center gap-2">
          <p>Use custom words only</p>
          <input
            type="checkbox"
            name="customWord"
            id="customWord"
            className="md:w-[20px] md:h-[20px] w-[16px] h-[16px]"
            onChange={() => setCustomWords((prev) => !prev)}
          />
        </div>
      </div>

      <textarea
        className="w-full h-24 md:h-36 bg-white text-black text-xs md:text-base p-2 rounded mt-1 mb-1"
        placeholder="Minimum of 10 words. 1-32 characters per word! 20000 characters maximum. Separated by a comma (,)"
        onChange={handleTextareaChange}
        value={customWordInput}
        disabled={!customWords}
      />

      <div className="flex md:gap-1 gap-[3px] text-xs md:text-lg font-bold px-[3px]">
        <button
          onClick={handleGameStart}
          className="bg-green-600 hover:bg-green-700 md:py-3 py-2 rounded-custom w-3/4"
        >
          Start!
        </button>
        <button
          onClick={CopyToClipboard}
          className="bg-blue-600 hover:bg-blue-700 rounded-custom w-1/4 flex gap-2 items-center justify-center"
        >
          <FaUserPlus />
          Invite
        </button>
      </div>
    </main>
  );
};

export default GameSetting;
