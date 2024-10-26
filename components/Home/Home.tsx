"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { generateRoomID } from "../../utils/utils";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setLoading } from "../../redux/actions/allActions";

const Home = () => {
  const [name, setName] = React.useState<string>("");
  const [inviteRoomid, setInviteRoomid] = React.useState<string | null>("");

  const router = useRouter();

  const searchParams = useSearchParams();

  const isLoading = useAppSelector((state) => state.other.isLoading);
  const dispatch = useAppDispatch();

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

  const handlePrivateRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    const roomid = generateRoomID();
    if (name) {
      router.push(`/private-room/${roomid}?playerName=${name}`);
    } else {
      alert("Please enter a name");
    }
    dispatch(setLoading(true));
  };

  const handlePlay = () => {
    if (name) {
      if (inviteRoomid) {
        router.push(`/private-room/${inviteRoomid}?playerName=${name}`);
      } else {
        // PLAYER WILL JOIN AN RANDOM GAME
      }
    } else {
      alert("Please enter a name");
    }
  };

  useEffect(() => {
    dispatch(setLoading(false));
    const storedName = sessionStorage.getItem("playerName") || "";
    setName(storedName);
    // setInviteRoomid(searchParams);
    const paramKeys = Array.from(searchParams.keys());

    setInviteRoomid(paramKeys[0]);
  }, []);

  return (
    <>
      <section
        className="h-[100vh] w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(/icon/background1.png)`,
        }}
      >
        <div className="flex flex-col items-center justify-center h-full container mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Image
                unoptimized
                alt="skrible.io"
                src="/gif/logo.gif"
                height={500}
                width={500}
                priority
              />
            </Link>
          </div>

          <div className="bg-panelBg shadow-lg rounded-custom p-4 w-[350px] text-center flex flex-col gap-4">
            <div>
              <input
                type="text"
                placeholder="Enter your name"
                name="user-name"
                value={name}
                onChange={onChange}
                onKeyDown={onKeyDown}
                onBlur={handleSave}
                className="w-full p-3 border border-gray-300 rounded-custom text-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              onClick={handlePlay}
              className="bg-[#53E237] hover:bg-[#38C41C] transition-all font-bold text-white rounded-custom py-3"
            >
              Play!
            </button>

            <button
              onClick={handlePrivateRoom}
              className="bg-[#1671c5] hover:bg-[#133F8C] transition-all font-bold text-white rounded-custom py-3"
            >
              Create Private Room
            </button>
          </div>
        </div>
      </section>
      {isLoading && (
        <section className="w-full h-full opacity-50 flex justify-center items-center bg-white absolute inset-0">
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
