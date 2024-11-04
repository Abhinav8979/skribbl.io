"use client";

import { useEffect, useRef, useState } from "react";

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
  setGameOver,
  setGamePlayers,
  setIsPlayerChoosingWord,
  setIsPlayerTURN,
  setLoading,
  setNextRound,
  setPlay,
  setPlayerIndex,
  setRoomOwner,
  setTotalPlayerGuessed,
  setWord,
  showScore,
} from "../redux/actions/allActions";
import Tippy from "@tippyjs/react";
import "tippy.js/animations/scale-subtle.css";
import "tippy.js/dist/tippy.css";
import GenerateAvatar from "../utils/GenerateAvatar";
import InviteModal from "../utils/InviteModal";
import Timer from "../utils/Timer";
import RevealString from "../utils/RevealText";
import { calculateScores, levenshteinDistance } from "../utils/gameFunctions";
import Score from "../components/Score";
import { updatePlayerScore } from "../redux/features/game/game";

interface Message {
  text: string;
  color: string;
}

interface Player {
  name: string;
  socketId: string;
  avatar: [number, number, number];
  score: number;
}

export default function PrivateRoomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string | null>(null);
  // const playerName = sessionStorage.getItem("playerName");

  const messages = useAppSelector((state) => state.game?.messages);
  const players = useAppSelector((state) => state.game?.players);

  const router = useRouter();
  // const rounds = useAppSelector((state) => state.gameSetting.rounds);
  const word = useAppSelector((state) => state.game?.word);
  const currentRound = useAppSelector((state) => state.game.currentRound);
  const totalRounds = useAppSelector((state) => state.gameSetting.rounds);
  const hints = useAppSelector((state) => state.gameSetting.hints);
  const currentPlayerIndex = useAppSelector((state) => state.other.playerIndex);
  const playerTurn = useAppSelector((state) => state.other.isPlayerTurn);
  const totalPlayers = useAppSelector((state) => state.gameSetting.Players);
  const NumberOfPlayerGuessed = useAppSelector(
    (state) => state.game.NumberOfPlayerGuessed
  );

  const socket = getSocket();

  const { roomid } = useParams();

  const searchParams = useSearchParams();
  const inviteRoomid = searchParams.get("");

  const dispatch = useAppDispatch();

  const onConnect = () => {
    setIsConnected(true);
    const eye = sessionStorage.getItem("avatarEye");
    const mouth = sessionStorage.getItem("avatarMouth");
    const face = sessionStorage.getItem("avatarFace");

    const avatar = [eye, mouth, face];

    if (eye && mouth && face) {
      if (players.length === totalPlayers) {
        alert("Game is full, please join another game.");
        router.push("/");
        return;
      }
      socket.emit("player:connected", {
        name: playerName,
        roomid,
        avatar,
        totalPlayers,
      });
    }
  };

  const onPlayerListUpdate = ({
    playerList,
    messages,
  }: {
    playerList: Player[];
    messages: Message[];
  }) => {
    // setPlayers(playerList);
    dispatch(setGamePlayers(playerList));
    dispatch(setGameMessage(messages));

    // setMessages((prev) => [...prev, ...messages]);
  };

  const onMessageBroadcast = (newMessages: Message) => {
    dispatch((dispatch, getState) => {
      const currentMessages = getState().game.messages;
      dispatch(setGameMessage([...currentMessages, newMessages]));
    });
  };

  const onGameWord = (word: string) => {
    dispatch(setWord(word));
    dispatch(setIsPlayerChoosingWord(false));
    // dispatch(setIsPlayerTURN(true));
    // dispatch(showScore(false));
  };

  const onTotalPlayerGuesseed = ({
    currentCount,
    playerSocketId,
    score,
  }: {
    score: number;
    playerSocketId: string;
    currentCount: number;
  }) => {
    dispatch(updatePlayerScore({ playerSocketId, score }));
    dispatch(setTotalPlayerGuessed(currentCount));
  };

  const onPlayerDisconnect = ({
    playerList,
    messages,
  }: {
    playerList: Player[];
    messages: Message[];
  }) => {
    dispatch(setGamePlayers(playerList));
    dispatch(setGameMessage(messages));
  };

  const onGameStart = (confirm: boolean) => {
    dispatch(setPlay(confirm));
  };

  const handleTimeUp = () => {
    dispatch(showScore(true));
    // dispatch(setWord(""));
    // let index;
    // dispatch((dispatch, getState) => {
    //   index = getState().other.playerIndex;

    //   if (index + 1 > players.length) {
    //     index = 0;
    //     dispatch((dispatch, getState) => {
    //       const nextRound = getState().game.currentRound;
    //       if (nextRound !== totalRounds) {
    //         dispatch(setNextRound(nextRound + 1));
    //         return;
    //       } else {
    //         // dispatch(gameOver(true);)
    //         alert("game over");
    //       }
    //     });
    //   } else {
    //     // dispatch(setPlayerIndex(index + 1));
    //   }
    // });
  };

  useEffect(() => {
    if (NumberOfPlayerGuessed === players.length) {
      handleTimeUp();
    }
  }, [NumberOfPlayerGuessed]);

  useEffect(() => {
    dispatch(setLoading(false));

    const playerName = sessionStorage.getItem("playerName");
    setPlayerName(playerName);

    const eye = sessionStorage.getItem("avatarEye");
    const mouth = sessionStorage.getItem("avatarMouth");
    const face = sessionStorage.getItem("avatarFace");

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
    const isOwner = socket.id === players[0]?.socketId;
    dispatch(setRoomOwner(isOwner));
  }, [players]);

  useEffect(() => {
    // if (!playerName) {
    //   let pageUrl = window.location.origin;
    //   if (inviteRoomid) {
    //     pageUrl += "/?" + inviteRoomid;
    //   }
    //   router.push(pageUrl);
    //   return;
    // }

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
      socket.on("start", onGameStart);
      socket.on("game:word", onGameWord);
      // socket.on("game:nextPlayerIndex", onNextPlayerIndex);
      socket.on("game:totalPlayerGuesseed", onTotalPlayerGuesseed);

      return () => {
        socket.off("connect", onConnect);
        socket.off("playerList:update", onPlayerListUpdate);
        socket.off("player:disconnect", onPlayerDisconnect);
        socket.off("playerMessage:broadcast", onMessageBroadcast);
        socket.off("copy:clipboard", onMessageBroadcast);
        socket.off("start", onGameStart);
      };
    }
  }, [socket, playerName, roomid, router]);

  useEffect(() => {
    if (currentPlayerIndex < players.length) {
      const isCurrentPlayerChoosingWord =
        players[currentPlayerIndex]?.socketId === socket.id;

      dispatch(setIsPlayerChoosingWord(true));
      dispatch(setIsPlayerTURN(isCurrentPlayerChoosingWord));
    } else {
      if (currentRound + 1 > totalRounds) {
        dispatch(setGameOver(true));
      } else {
        dispatch(setNextRound(currentRound + 1));
        dispatch(setPlayerIndex(0));
      }
    }
  }, [socket, currentPlayerIndex, players]);

  if (!isConnected) {
    return <p>You are offline</p>;
  }

  return (
    <>
      <section
        className="flex flex-col items-center pt-2 pb-16 min-h-screen text-white"
        style={{ backgroundImage: "url(/icon/background1.png)" }}
      >
        <div className="w-[86%] flex gap-1 flex-col">
          <Link href="/">
            <Image
              alt="skrible.io"
              src="/gif/logo_halloween.gif"
              height={320}
              width={320}
              priority
              unoptimized
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
          <div className="flex justify-between items-center bg-white text-black p-[3px]">
            <div className="flex gap-1 items-center">
              <div className="relative">
                <Image
                  src="/gif/clock.gif"
                  alt="clock image"
                  unoptimized
                  height={50}
                  width={50}
                  className="scale-[1.2]"
                />
                <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[42%] text-xl font-medium">
                  {word && <Timer onTimeUp={handleTimeUp} startTime={20} />}
                </p>
              </div>
              <p>
                ROUND {currentRound} OF {totalRounds}
              </p>
            </div>
            <div>
              {word && word.length > 0 ? (
                !playerTurn ? (
                  <div className="flex items-center flex-col">
                    <p className="font-medium">Guess Word</p>
                    <RevealString word={word} hint={hints} />
                  </div>
                ) : (
                  word
                )
              ) : (
                <p className="font-semibold">Waiting</p>
              )}
            </div>
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
              <PlayerBoard players={players} socketId={socket.id} />
            </div>
            <div className="w-[63%]">{children}</div>
            <div className="w-[20%]">
              <Chat message={messages} socket={socket} />
            </div>
          </div>
        </div>
      </section>
      <Score players={players} />
    </>
  );
}

interface PlayerBoardProps {
  players?: Player[]; // Updated to expect Player objects
  socketId: string | undefined;
}

const PlayerBoard: React.FC<PlayerBoardProps> = ({ players, socketId }) => {
  const [inviteModal, setInviteModal] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const avatar = useAppSelector((state) => state.game.avatar);
  const playerIndex = useAppSelector((state) => state.other.playerIndex);

  const isPlayerTurn = useAppSelector((state) => state.other.isPlayerTurn);
  const isOwner = useAppSelector((state) => state.other.roomOwner);
  const isDrawing = useAppSelector((state) => state.other.isDrawing);

  return (
    <>
      {/* {inviteModal && (
        <div className="absolute inset-0  flex items-center justify-center">
          <div className="bg-black opacity-40 absolute inset-0"></div>
          <InviteModal
            avatar={avatar}
            name={players?.find((player) => player.socketId === socketId)?.name}
            setInviteModal={setInviteModal}
            key={socketId}
          />
        </div>
      )} */}
      {players && players.length > 0 ? (
        players.map((player, index) => {
          const isCurrentPlayer = player.socketId === socketId;

          return (
            <div
              key={index}
              className="pl-2 my-1 gap-3 text-sm text-black bg-white rounded-md border border-black flex justify-between items-center h-[68px]"
            >
              <div>
                <p className="font-bold">#{index + 1}</p>
                {isOwner && (
                  <p>
                    <Image
                      src="/gif/owner.gif"
                      alt="crown"
                      height={20}
                      width={20}
                      unoptimized
                    />
                  </p>
                )}
              </div>
              <div className="flex justify-center flex-col">
                <div className="flex">
                  {player.name}
                  <p className="ml-1">{isCurrentPlayer && "(You)"}</p>
                </div>
                <p className="whitespace-nowrap">0 points</p>
              </div>
              {isDrawing && (
                <div>
                  <Image
                    width={40}
                    height={40}
                    alt="bursh"
                    src="/gif/how.gif"
                    unoptimized
                  />
                </div>
              )}
              <div
                onClick={
                  isCurrentPlayer ? () => setInviteModal(true) : undefined
                }
                className={`w-[120px] h-[120px] overflow-hidden mx-auto relative scale-[.6] items-center ${
                  isCurrentPlayer
                    ? "cursor-pointer hover:scale-[.7] transition-all duration-500 ease-out"
                    : ""
                }`}
              >
                <GenerateAvatar
                  key={player?.socketId}
                  eye={player?.avatar?.[0]}
                  face={player?.avatar?.[2]}
                  mouth={player?.avatar?.[1]}
                />
              </div>
            </div>
          );
        })
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

interface PlayerInfo {
  guessTime: number;
  guessOrder: number;
}

const Chat: React.FC<MessageProps> = ({ message, socket }) => {
  const [playerMessage, setPlayerMessage] = useState<string>("");
  const { roomid } = useParams<{ roomid: string }>();
  const messageEndRef = useRef<HTMLDivElement>(null);

  const play = useAppSelector((state) => state.other.Play);
  const word = useAppSelector((state) => state.game.word);
  const dispatch = useAppDispatch();

  const players = useAppSelector((state) => state.game.players);
  const gameTime = useAppSelector((state) => state.gameSetting.Drawtime);
  const NumberOfPlayerGuessed = useAppSelector(
    (state) => state.game.NumberOfPlayerGuessed
  );

  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  // Update elapsed time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [word]);

  const handleSendRequest = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && playerMessage.trim()) {
      if (word && play && word.length === playerMessage.length) {
        const distance = levenshteinDistance({ a: word, b: playerMessage });

        if (distance === 0) {
          const name = sessionStorage.getItem("playerName");
          const playerInfo: PlayerInfo = {
            guessTime: timeElapsed,
            guessOrder: NumberOfPlayerGuessed,
          };

          // Calculate score based on time and order
          const score = calculateScores(playerInfo, gameTime);

          socket?.emit("player:guessed-word", {
            playerName: name,
            roomid,
            playerSocketId: socket.id,
            score,
          });
        } else if (distance === 1) {
          dispatch((dispatch, getState) => {
            const currentMessages = getState().game.messages;
            dispatch(
              setGameMessage([
                ...currentMessages,
                { text: "You are close!!", color: "#00FF9C" },
              ])
            );
          });
        } else {
          socket?.emit("player:message-send", { playerMessage, roomid });
        }
      } else {
        socket?.emit("player:message-send", { playerMessage, roomid });
      }
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
    <div className="text-sm text-black bg-white gap-12 h-[75vh] flex flex-col justify-end rounded-md">
      <div className="h-72 overflow-y-scroll flex flex-col gap-2 mb-4">
        <div className="align-text-bottom font-medium capitalize flex gap-1 flex-col">
          {message &&
            message.map((msg, index) => (
              <p
                key={index}
                className={
                  index % 2 === 0
                    ? "bg-black bg-opacity-60 p-1"
                    : "bg-white p-1"
                }
              >
                <span style={{ color: msg.color }}>{msg.text}</span>
              </p>
            ))}
          <div ref={messageEndRef} />
        </div>
      </div>
      <div className="flex items-center gap-2 p-2">
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
