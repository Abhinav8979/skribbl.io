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
  setAvatar,
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
    const eye = sessionStorage.getItem("avatarEye") || 0;
    const mouth = sessionStorage.getItem("avatarMouth") || 0;
    const face = sessionStorage.getItem("avatarFace") || 0;

    if (eye && mouth && face) {
      dispatch(
        setAvatar({
          eye: parseInt(eye),
          mouth: parseInt(mouth),
          face: parseInt(face),
        })
      );
    } else {
      router.push("/");
    }
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
        socket.off("copy:clipboard", onMessageBroadcast);
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
  const { face, eye, mouth } = useAppSelector((state) => state.game?.avatar);
  // console.log(face, eye, mouth);

  const facesPerRow = 10,
    totalFaces = 28,
    faceWidth = 120,
    faceHeight = 120;

  const eyesPerRow = 10,
    totalEyes = 61,
    eyeWidth = 100,
    eyeHeight = 101;

  const mouthsPerRow = 10,
    totalMouths = 67,
    mouthWidth = 100,
    mouthHeight = 101;

  const calculateBackgroundPosition = (
    index: number,
    itemsPerRow: number,
    width: number,
    height: number
  ) => {
    const row = Math.floor(index / itemsPerRow);
    const col = index % itemsPerRow;
    return { backgroundPosition: `-${col * width}px -${row * height}px` };
  };
  return (
    <>
      {players && players.length > 0 ? (
        players.map((name, index) => (
          <div
            key={index}
            className="pl-2 my-1 gap-3 text-sm text-black bg-white rounded-md border border-black flex justify-between items-center h-[68px]"
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
              <p className="whitespace-nowrap">0 points</p>
            </div>
            {/* <div>user character</div> */}
            <div className="w-[120px] h-[120px] overflow-hidden mx-auto relative   scale-[.6] items-center">
              <div
                className="w-full h-full bg-no-repeat absolute"
                style={{
                  backgroundImage: "url(/gif/color_atlas.gif)",
                  backgroundSize: `${faceWidth * facesPerRow}px auto`,
                  ...calculateBackgroundPosition(
                    face,
                    facesPerRow,
                    faceWidth,
                    faceHeight
                  ),
                }}
              ></div>
              <div
                className="w-[100px] h-[80px] bg-no-repeat absolute top-[10%] left-[6%]"
                style={{
                  backgroundImage: "url(/gif/eyes_atlas.gif)",
                  backgroundSize: `${eyeWidth * eyesPerRow}px auto`,
                  ...calculateBackgroundPosition(
                    eye,
                    eyesPerRow,
                    eyeWidth,
                    eyeHeight
                  ),
                }}
              ></div>
              <div
                className="w-[100px] h-[80px] bg-no-repeat absolute bottom-[22%] left-[8%]"
                style={{
                  backgroundImage: "url(/gif/mouth_atlas.gif)",
                  backgroundSize: `${mouthWidth * mouthsPerRow}px auto`,
                  ...calculateBackgroundPosition(
                    mouth,
                    mouthsPerRow,
                    mouthWidth,
                    mouthHeight
                  ),
                }}
              ></div>
            </div>
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
