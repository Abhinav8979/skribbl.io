"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { generateRoomID } from "../../utils/utils";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setLoading } from "../../redux/actions/allActions";
import Character from "./CharacterEdit";

const Home = () => {
  const [name, setName] = useState<string>("");
  const [inviteRoomid, setInviteRoomid] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.other.isLoading);
  const avatar = useAppSelector((state) => state.game.avatar);

  const handleSave = () => {
    sessionStorage.setItem("playerName", name);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const handlePrivateRoom = () => {
    const roomid = generateRoomID();
    if (name) {
      dispatch(setLoading(true));
      sessionStorage.setItem("avatarEye", avatar.eye.toString());
      sessionStorage.setItem("avatarFace", avatar.face.toString());
      sessionStorage.setItem("avatarMouth", avatar.mouth.toString());
      router.push(`/private-room/${roomid}?playerName=${name}`);
    } else {
      alert("Please enter a name");
    }
  };

  const handlePlay = () => {
    if (name) {
      sessionStorage.setItem("avatarEye", avatar.eye.toString());
      sessionStorage.setItem("avatarFace", avatar.face.toString());
      sessionStorage.setItem("avatarMouth", avatar.mouth.toString());

      if (inviteRoomid) {
        router.push(`/private-room/${inviteRoomid}?playerName=${name}`);
      } else {
        router.push(`/play`);

        // Logic for joining a random game can be added here
      }
    } else {
      alert("Please enter a name");
    }
  };

  useEffect(() => {
    dispatch(setLoading(false));
    const storedName = sessionStorage.getItem("playerName") || "";
    setName(storedName);

    const paramKeys = Array.from(searchParams.keys());
    setInviteRoomid(paramKeys[0]);
  }, [dispatch, searchParams]);

  return (
    <>
      <section
        className="h-[100vh] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(/icon/background1.png)` }}
      >
        <div className="flex flex-col items-center justify-center h-full container mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Image
                unoptimized
                alt="skrible.io"
                src="/gif/logo_halloween.gif"
                height={500}
                width={500}
                priority
              />
            </Link>
          </div>

          <div className="bg-panelBg shadow-lg rounded-custom p-4 w-[350px] text-center flex flex-col gap-2">
            <div className="flex justify-between gap-4">
              <div className="flex items-end">
                <input
                  type="text"
                  placeholder="Enter your name"
                  name="user-name"
                  value={name}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  onBlur={handleSave}
                  className="w-full p-1 border rounded-custom text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="language-select"
                  className="block mt-2 text-white text-sm whitespace-nowrap"
                >
                  Select Language
                </label>
                <select
                  id="language-select"
                  name="language"
                  defaultValue="English"
                  className="w-full p-1 text-sm mt-1  rounded-custom  text-left focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="bg-[#53E237] hover:bg-[#38C41C] transition-all font-bold text-white rounded-custom py-3"
            >
              Play!
            </button>

            <button
              onClick={handlePrivateRoom}
              className="bg-[#1671c5] hover:bg-[#1671C5] transition-all font-bold text-white rounded-custom py-3"
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
