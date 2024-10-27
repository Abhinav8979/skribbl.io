"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaPaperPlane } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Socket } from "socket.io-client";
import { getSocket } from "../app/socket";
import {
  setGameMessage,
  setGamePlayers,
  setLoading,
} from "../redux/actions/allActions";
import Tippy from "@tippyjs/react";
import "tippy.js/animations/scale-subtle.css";
import "tippy.js/dist/tippy.css";

interface Message {
  text: string;
  color: string;
}

export default function PrivateRoomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isConnected, setIsConnected] = useState(false);

  const messages = useAppSelector((state) => state.game?.messages);
  const players = useAppSelector((state) => state.game?.players);

  const router = useRouter();
  const rounds = useAppSelector((state) => state.gameSetting.rounds);
  const socket = getSocket();

  const playerName = useMemo(() => sessionStorage.getItem("playerName"), []);
  const { roomid } = useParams();

  const searchParams = useSearchParams();
  const inviteRoomid = searchParams.get("");

  const dispatch = useAppDispatch();

  const onConnect = () => {
    setIsConnected(true);
    socket.emit("player:connected", { name: playerName, roomid });
  };

  const onPlayerListUpdate = ({
    playerList,
    messages,
  }: {
    playerList: string[];
    messages: Message[];
  }) => {
    // setPlayers(playerList);
    dispatch(setGamePlayers(playerList));
    dispatch(setGameMessage(messages));

    // setMessages((prev) => [...prev, ...messages]);
  };

  const onMessageBroadcast = (newMessages: Message[]) => {
    // setMessages(newMessages);
    dispatch(setGameMessage(newMessages));
  };

  const onPlayerDisconnect = ({
    playerList,
    messages,
  }: {
    playerList: string[];
    messages: Message[];
  }) => {
    dispatch(setGamePlayers(playerList));
    dispatch(setGameMessage(messages));
  };

  useEffect(() => {
    dispatch(setLoading(false));
  }, []);

  useEffect(() => {
    if (!playerName) {
      let pageUrl = window.location.origin;
      if (inviteRoomid) {
        pageUrl += "/?" + inviteRoomid;
      }
      router.push(pageUrl);
      return;
    }

    if (socket) {
      if (socket.connected) {
        setIsConnected(true);
      } else {
        socket.connect();
      }

      socket.on("connect", onConnect);
      socket.on("playerList:update", onPlayerListUpdate);
      socket.on("playerMessage:broadcast", onMessageBroadcast);
      socket.on("player:disconnect", onPlayerDisconnect);
      socket.on("copy:clipboard", onMessageBroadcast);

      return () => {
        socket.off("connect", onConnect);
        socket.off("playerList:update", onPlayerListUpdate);
        socket.off("player:disconnect", onPlayerDisconnect);
        socket.off("playerMessage:broadcast", onMessageBroadcast);
      };
    }
  }, [socket, playerName, roomid, router]);

  if (!isConnected) {
    return <p>You are offline</p>;
  }

  return (
    <section
      className="flex flex-col items-center pt-2 pb-16 min-h-screen text-white"
      style={{ backgroundImage: "url(/icon/background1.png)" }}
    >
      <div className="w-[86%] flex gap-1 flex-col">
        <Link href="/">
          <Image
            alt="skrible.io"
            src="/gif/logo.gif"
            height={320}
            width={320}
            priority
            unoptimized
          />
        </Link>
        <div className="flex justify-between items-center bg-white text-black p-[3px]">
          <div className="flex gap-1 items-center">
            <Image
              src="/gif/clock.gif"
              alt="clock image"
              unoptimized
              height={50}
              width={50}
            />
            <p>ROUND 1 OF {rounds}</p>
          </div>
          <p className="font-semibold">Waiting</p>
          <div className="cursor-pointer">
            <Tippy
              content="Setting"
              animation="scale-subtle"
              arrow={true}
              placement="left"
            >
              <Image
                src="/gif/settings.gif"
                alt="settings image"
                height={50}
                width={50}
                unoptimized
              />
            </Tippy>
          </div>
        </div>
        <div className="flex gap-2 justify-between w-full">
          <div className="w-[17%]">
            <PlayerBoard players={players} />
          </div>
          <div className="w-[63%]">{children}</div>
          <div className="w-[20%]">
            <Chat message={messages} socket={socket} />
          </div>
        </div>
      </div>
    </section>
  );
}

interface PlayerBoardProps {
  players?: string[];
}

const PlayerBoard: React.FC<PlayerBoardProps> = ({ players }) => {
  return (
    <>
      {players && players.length > 0 ? (
        players.map((name, index) => (
          <div
            key={index}
            className="p-2 my-1 text-sm text-black bg-white rounded-md border border-black flex justify-between"
          >
            <div>
              <p className="font-bold">#{index + 1}</p>
              {index === 0 && (
                <p>
                  <Image
                    src="/gif/owner.gif"
                    alt="crown"
                    height={20}
                    width={20}
                  />
                </p>
              )}
            </div>
            <div className="flex justify-center flex-col">
              {name}
              <p>0 points</p>
            </div>
            <div>user character</div>
          </div>
        ))
      ) : (
        <div className="p-2 text-sm text-black bg-white rounded-md">
          No players online
        </div>
      )}
    </>
  );
};

interface MessageProps {
  message: Message[];
  socket: Socket | null;
}

const Chat: React.FC<MessageProps> = ({ message, socket }) => {
  const [playerMessage, setPlayerMessage] = useState("");
  const { roomid } = useParams();
  const messageEndRef = useRef<HTMLDivElement>(null);

  const handleSendRequest = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && playerMessage.trim()) {
      socket?.emit("player:message-send", { playerMessage, roomid });
      setPlayerMessage("");
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPlayerMessage(e.target.value);
  };

  // Scroll to the bottom whenever the message list changes
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div className="p-2 text-sm text-black bg-white gap-12 h-[75vh] flex flex-col justify-end rounded-md border border-black">
      <div className="h-72 overflow-y-scroll flex flex-col gap-2 mb-4">
        <div className="align-text-bottom font-medium capitalize flex gap-1 flex-col">
          {message &&
            message.map((msg, index) => (
              <p key={index}>
                <span style={{ color: msg.color }}>{msg.text}</span>
              </p>
            ))}
          {/* Ref to automatically scroll to the latest message */}
          <div ref={messageEndRef} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          name="chat-box"
          id="chat-box"
          value={playerMessage}
          placeholder="write your message"
          className="border w-full rounded-md border-black p-2"
          onKeyDown={handleSendRequest}
          onChange={onChange}
        />
        <span className="text-lg p-2 md:hidden block cursor-pointer">
          <FaPaperPlane />
        </span>
      </div>
    </div>
  );
};
