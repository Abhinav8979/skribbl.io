"use client";

import Image from "next/image";
import { FaUserPlus } from "react-icons/fa";
import { useAppDispatch } from "../../../redux/hooks";
import React, { useEffect, useState } from "react";
import { setGameSetting } from "../../../redux/actions/allActions";
import { getSocket } from "../../socket";
import { useParams } from "next/navigation";
import { Socket } from "socket.io-client";

export default function Page() {
  type SettingOption = number | string;

  const { roomid } = useParams();

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

  const [invite, setInvite] = useState<boolean>(false);
  const socket: Socket = getSocket();

  const handleCopyUrl = () => {
    const pageUrl = window.location.origin + "/?" + roomid;
    navigator.clipboard.writeText(pageUrl).then(() => {
      setInvite(false);
    });
  };

  const CopyToClipboard = () => {
    const pageUrl = window.location.origin + "/?" + roomid;
    navigator.clipboard.writeText(pageUrl).then(() => {
      socket.emit("copy:clipboard", {
        message: "Copied room link to clipboard!",
        roomid,
      });
    });
  };

  return (
    <>
      <main className="flex p-2 flex-col gap-1 bg-[#35394A] rounded-custom text-white">
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
          <button className="bg-green-600 hover:bg-green-700 py-3 rounded-custom w-3/4">
            Start!
          </button>
          <button
            // onClick={() => setInvite(true)}.
            onClick={CopyToClipboard}
            className="bg-blue-600 hover:bg-blue-700 rounded-custom w-1/4 flex gap-2 items-center justify-center"
          >
            <FaUserPlus />
            Invite
          </button>
        </div>
      </main>

      {invite && (
        <section
          className="absolute inset-0 bg-black  bg-opacity-30 min-h-screen flex justify-center items-center"
          onClick={() => setInvite(false)}
        >
          <div
            className="bg-white rounded-lg p-5 w-[300px] h-[200px] flex flex-col items-center justify-around"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-black text-lg font-medium text-center">
              Invite your friends to join the game by sharing the link below:
            </p>
            <button
              onClick={handleCopyUrl}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded mt-3"
            >
              Copy URL
            </button>
            <button
              onClick={() => setInvite(false)}
              className="text-red-500 font-semibold mt-2"
            >
              Close
            </button>
          </div>
        </section>
      )}
    </>
  );
}
