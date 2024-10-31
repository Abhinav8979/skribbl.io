"use client";

import Image from "next/image";
import { FaUserPlus } from "react-icons/fa";
import React, { useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setGameSetting } from "../redux/actions/allActions";
import { getSocket } from "../app/socket";

const GameSetting = () => {
  type SettingOption = number | string;

  const { roomid } = useParams();

  const isOwner = useAppSelector((state) => state?.other?.PlayerOwner);
  console.log(isOwner);

  interface Setting {
    name: string;
    options: SettingOption[];
    currentValue: SettingOption;
  }

  interface PlayerSetting {
    Players: number;
    Drawtime: number;
    rounds: number;
    wordCount: number;
    hints: number;
    Language: string;
    gameMode: string;
  }

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
      options: Array.from({ length: 10 }, (_, i) => i + 10),
      currentValue: 80,
    },
    {
      name: "rounds",
      options: Array.from({ length: 19 }, (_, i) => i + 2),
      currentValue: 8,
    },
    {
      name: "gameMode",
      options: ["Normal", "Hidden", "Combination"],
      currentValue: "normal",
    },
    {
      name: "wordCount",
      options: [1, 2, 3, 4, 5],
      currentValue: 3,
    },
    {
      name: "hints",
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
    socket.emit("start:game", roomid);
  };

  const CopyToClipboard = () => {
    const pageUrl = window.location.origin + "/?" + roomid;
    navigator.clipboard.writeText(pageUrl).then(() => {
      socket.emit("copy:clipboard", roomid);
    });
  };

  return (
    <main
      style={{
        cursor: isOwner ? "default" : "not-allowed",
      }}
      className="flex p-2 flex-col gap-1 bg-[#35394A] rounded-custom text-white relative"
    >
      {!isOwner && <div className="absolute inset-0 bg-black opacity-40"></div>}

      {setting.map((ele, index) => (
        <div key={index} className="flex justify-between items-center py-1">
          <div className="flex items-center gap-2">
            <Image
              src={`/gif/setting_${index}.gif`}
              alt="image"
              unoptimized
              height={30}
              width={30}
            />
            <span className="text-lg font-semibold">{ele.name}</span>
          </div>
          <select
            className="bg-white text-black p-2 rounded w-1/2"
            defaultValue={ele.currentValue}
            onChange={(e) => handleChange(e, ele.name)}
          >
            {ele.options.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}

      <div className="flex justify-between items-center mt-4">
        <h3 className="font-semibold text-lg">Custom Words</h3>
        <div className="flex items-center gap-2">
          <p>Use custom words only</p>
          <input
            type="checkbox"
            name="customWord"
            id="customWord"
            className="w-[20px] h-[20px]"
          />
        </div>
      </div>

      <textarea
        className="w-full h-36 bg-white text-black p-2 rounded mt-2"
        placeholder="Minimum of 10 words. 1-32 characters per word! 20000 characters maximum. Separated by a comma (,) "
      />

      <div className="flex gap-1 text-lg font-bold">
        <button
          onClick={handleGameStart}
          className="bg-green-600 hover:bg-green-700 py-3 rounded-custom w-3/4"
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
