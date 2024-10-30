import { createServer } from "node:http";
import next from "next";
import { Server, Socket } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let player: Map<string, { name: string; roomid: string }> = new Map();
interface Message {
  text: string;
  color: string;
}

let roomMessages: Record<string, Message[]> = {};

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.on("connection", (socket: Socket) => {
    socket.on("player:connected", ({ name, roomid }) => {
      if (!roomMessages[roomid]) {
        roomMessages[roomid] = [];
      }

      if (roomMessages[roomid].length === 0) {
        roomMessages[roomid].push({
          text: `${name} is the owner of the room`,
          color: "#BED754",
        });
      } else if (!player.get(socket.id)) {
        roomMessages[roomid].push({
          text: `${name} joined the room`,
          color: "#03C988",
        });
      }

      player.set(socket.id, { name, roomid });
      const playerList = Array.from(player.values())
        .filter((p) => p.roomid === roomid)
        .map((p) => p.name);

      socket.join(roomid);
      io.to(roomid).emit("playerList:update", {
        playerList,
        messages: roomMessages[roomid],
      });
    });

    socket.on("player:message-send", ({ playerMessage, roomid }) => {
      if (roomMessages[roomid]) {
        const newMessage = { text: playerMessage, color: "#191919" };
        roomMessages[roomid].push(newMessage);

        io.to(roomid).emit("playerMessage:broadcast", roomMessages[roomid]);
      }
    });

    socket.on("copy:clipboard", ({ message, roomid }) => {
      if (message && roomid) {
        roomMessages[roomid].push({ text: message, color: "#FFF100" });
        socket.emit("copy:clipboard", roomMessages[roomid]);
      }
    });

    socket.on("player:draw", ({ drawingData, roomid }) => {
      io.to(roomid).emit("player:draw", { drawingData, id: socket.id });
    });

    socket.on("start:game", (roomid) => {
      io.to(roomid).emit("start", true);
    });

    socket.on("disconnect", () => {
      const playerData = player.get(socket.id);
      if (playerData) {
        const { roomid } = playerData;
        player.delete(socket.id);

        const playerList = Array.from(player.values())
          .filter((p) => p.roomid === roomid)
          .map((p) => p.name);

        roomMessages[roomid].push({
          text: `${playerData.name} left the room`,
          color: "red",
        });

        io.to(roomid).emit("player:disconnect", {
          playerList,
          messages: roomMessages[roomid],
        });

        if (playerList.length === 0) {
          delete roomMessages[roomid];
        }
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
