import { createServer } from "node:http";
import next from "next";
import { Server, Socket } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = 3001;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let player: Map<
  string,
  {
    name: string;
    socketId: string;
    avatar: [string, string, string];
    totalScore?: number;
  }[]
> = new Map();

interface Message {
  text: string;
  color: string;
  senderName?: string;
}

let roomMessages: Record<string, Message[]> = {};

let availableRoom: string[] = [];

let playerName: Map<string, number> = new Map();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.on("connection", (socket: Socket) => {
    socket.on("player:connected", ({ name, roomid, avatar, totalPlayers }) => {
      if (!roomMessages[roomid]) {
        roomMessages[roomid] = [];
      }

      if (roomMessages[roomid].length === 0) {
        roomMessages[roomid].push({
          text: `${name} is the owner of the room`,
          color: "#BED754",
        });
      } else if (
        !Array.from(player.values()).some((p) =>
          p.some((pl) => pl.socketId === socket.id)
        )
      ) {
        roomMessages[roomid].push({
          text: `${name} joined the room`,
          color: "#03C988",
        });
      }

      const newPlayer = { name, socketId: socket.id, avatar };
      const playersInRoom = player.get(roomid) || [];
      playersInRoom.push(newPlayer);
      player.set(roomid, playersInRoom);

      // const playerList = playersInRoom.map((p) => p.name);

      if (totalPlayers === player.size + 1) {
        availableRoom.filter((id) => id !== roomid);
      } else {
        availableRoom.push(roomid);
      }

      socket.join(roomid);
      io.to(roomid).emit("playerList:update", {
        playerList: playersInRoom,
        messages: roomMessages[roomid],
      });
    });

    socket.on(
      "player:message-send",
      ({ playerMessage, roomid, senderName }) => {
        if (roomMessages[roomid]) {
          const newMessage = {
            text: playerMessage,
            color: "#191919",
            senderName,
          };
          roomMessages[roomid].push(newMessage);

          io.to(roomid).emit("playerMessage:broadcast", newMessage);
        }
      }
    );

    socket.on(
      "player:guessed-word",
      ({ name, roomid, playerSocketId, score }) => {
        if (roomMessages[roomid]) {
          const newMessage = {
            text: `${name} guessed the word!`,
            color: "green",
          };
          roomMessages[roomid].push(newMessage);
          const currentCount = playerName.get(roomid) || 0;
          playerName.set(roomid, currentCount + 1);

          const playersInRoom = player.get(roomid);
          if (playersInRoom) {
            const playerToUpdate = playersInRoom.find(
              (p) => p.socketId === playerSocketId
            );
            if (playerToUpdate) {
              playerToUpdate.totalScore =
                (playerToUpdate.totalScore || 0) + score;
            }
          }

          io.to(roomid).emit("game:totalPlayerGuesseed", {
            currentCount: currentCount + 1,
            playerSocketId,
            score,
          });

          io.to(roomid).emit("playerMessage:broadcast", newMessage);
        }
      }
    );

    socket.on("game:next-round", (roomid) => {
      playerName.set(roomid, 0);
    });

    socket.on("copy:clipboard", (roomid) => {
      if (roomid) {
        // roomMessages[roomid].push({ text: message, color: "#FFF100" });
        socket.emit("copy:clipboard", {
          text: "Copied room link to clipboard!",
          color: "#FFF100",
        });
      }
    });

    socket.on("game:word", ({ roomid, word }) => {
      io.to(roomid).emit("game:word", word);
    });

    socket.on("player:draw", ({ drawingData, roomid }) => {
      io.to(roomid).emit("player:draw", drawingData);
    });

    socket.on("clear:canvas", (roomid) => {
      io.to(roomid).emit("clear:canvas", []);
    });

    socket.on("start:game", (roomid) => {
      io.to(roomid).emit("start", true);
    });

    socket.on("game:over", (roomid) => {
      const playersInRoom = player.get(roomid);

      if (playersInRoom) {
        const sortedPlayers = playersInRoom
          .slice()
          .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
          .map(({ name, totalScore }) => ({
            name,
            totalScore: totalScore || 0,
          }));

        io.to(roomid).emit("game:over", sortedPlayers);
      } else {
        io.to(roomid).emit("game:over", []);
      }
    });

    socket.on(
      "game:random-join",
      ({
        name,
        avatar,
      }: {
        name: string;
        avatar: [string, string, string];
      }) => {
        const randomRoomId =
          availableRoom[Math.floor(Math.random() * availableRoom.length)];

        socket.emit("game:random-join", randomRoomId);
      }
    );

    socket.on("disconnect", () => {
      let roomid;
      let playerData;

      for (const [room, players] of player.entries()) {
        const index = players.findIndex((p) => p.socketId === socket.id);
        if (index !== -1) {
          roomid = room;
          playerData = players[index];
          players.splice(index, 1);
          break;
        }
      }

      if (roomid && playerData) {
        if (player.get(roomid)?.length === 0) {
          player.delete(roomid);
          delete roomMessages[roomid];
        }

        const playerList = (player.get(roomid) || []).map((p) => p.name);

        roomMessages[roomid]?.push({
          text: `${playerData.name} left the room`,
          color: "red",
        });

        io.to(roomid).emit("player:disconnect", {
          playerList,
          messages: roomMessages[roomid],
        });
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
