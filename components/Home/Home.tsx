"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { generateRoomID } from "../../utils/utils";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setLoading, setPlay } from "../../redux/actions/allActions";
import Character from "./CharacterEdit";
import { getSocket } from "../../app/socket";
import { Socket } from "socket.io-client";

const Home = () => {
  const [name, setName] = useState<string>("");
  const [inviteRoomid, setInviteRoomid] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.other.isLoading);
  const avatar = useAppSelector((state) => state.game.avatar);
  const socket: Socket = getSocket();

  const handleSave = useCallback(() => {
    sessionStorage.setItem("playerName", name);
  }, [name]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const handlePrivateRoom = useCallback(() => {
    if (name) {
      const roomid = generateRoomID();
      dispatch(setLoading(true));

      sessionStorage.setItem("avatarEye", avatar.eye.toString());
      sessionStorage.setItem("avatarFace", avatar.face.toString());
      sessionStorage.setItem("avatarMouth", avatar.mouth.toString());
      router.push(`/private-room/${roomid}?playerName=${name}`);
    } else {
      alert("Please enter a name");
    }
  }, [name, avatar, dispatch, router]);

  const handlePlay = useCallback(() => {
    if (name) {
      sessionStorage.setItem("avatarEye", avatar.eye.toString());
      sessionStorage.setItem("avatarFace", avatar.face.toString());
      sessionStorage.setItem("avatarMouth", avatar.mouth.toString());

      if (inviteRoomid) {
        router.push(`/private-room/${inviteRoomid}?playerName=${name}`);
      } else {
        socket.emit("game:random-join", { name, avatar });
        router.push(`/play`);
      }
    } else {
      alert("Please enter a name");
    }
  }, [name, avatar, inviteRoomid, router]);

  useEffect(() => {
    dispatch(setPlay(false));

    const storedName = sessionStorage.getItem("playerName") || "";
    setName(storedName);

    const paramKeys = Array.from(searchParams.keys());
    setInviteRoomid(paramKeys[0]);
  }, [dispatch, searchParams]);

  useEffect(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    socket.on("game:random-join", (randomRoomId) => {
      router.push(`/private-room/${randomRoomId}?playerName=${name}`);
    });
  }, []);

  return (
    <>
      <section
        className="h-[100vh] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(/icon/background1.png)` }}
      >
        <div className="flex flex-col items-center justify-center h-full container mx-auto px-4">
          <div className="mb-6">
            <Link href="/">
              <Image
                unoptimized
                alt="skrible.io"
                src="/gif/logo_halloween.gif"
                height={500}
                width={500}
                priority
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
          </div>

          <div className="bg-panelBg shadow-lg rounded-lg p-6 w-full max-w-[350px] text-center flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row justify-between sm:gap-4">
              <div className="flex items-end mb-4 sm:mb-0">
                <input
                  type="text"
                  placeholder="Enter your name"
                  name="user-name"
                  value={name}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  onBlur={handleSave}
                  className="w-full p-2 border rounded-md text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="language-select" className="text-white text-sm">
                  Select Language
                </label>
                <select
                  id="language-select"
                  name="language"
                  defaultValue="English"
                  className="w-full p-2 text-sm rounded-md text-left focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>

            <Character />

            <button
              onClick={handlePlay}
              className="bg-[#53E237] hover:bg-[#38C41C] transition-all font-bold text-white rounded-lg py-3 mt-4 w-full"
            >
              Play!
            </button>

            <button
              onClick={handlePrivateRoom}
              className="bg-[#1671c5] hover:bg-[#1671C5] transition-all font-bold text-white rounded-lg py-3 mt-2 w-full"
            >
              Create Private Room
            </button>
          </div>
        </div>
      </section>

      {isLoading && (
        <section className="w-full h-full opacity-70 flex justify-center items-center bg-white absolute inset-0 z-50">
          <Image
            width={100}
            height={100}
            unoptimized
            alt="loader"
            src="/gif/load.gif"
            className="animate-spin"
          />
        </section>
      )}
    </>
  );
};

export default Home;
