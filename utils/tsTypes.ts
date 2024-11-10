import { Socket } from "socket.io-client";

// Interface for player settings in a game
export interface PlayerSetting {
  Players: number;
  Drawtime: number;
  rounds: number;
  wordCount: number;
  hints: number;
  Language: string;
  gameMode: string;
}

// Interface for messages in the application
export interface Message {
  text: string;
  color: string;
  senderName?: string;
}

// Interface for an avatar with face, eye, and mouth options
export interface Avatar {
  face: number;
  eye: number;
  mouth: number;
}

// Interface for a player with name, socket ID, avatar, and score
export interface Player {
  name: string;
  socketId: string;
  avatar: [number, number, number];
  score: number;
}

// Interface for the application state with an array of messages
export interface State {
  messages: Message[];
}

// Interface for an action to set game messages
export interface SetGameMessageAction {
  type: string;
  payload: Message[];
}

// Interface for player information during a guessing game
export interface PlayerInfo {
  guessTime: number;
  guessOrder: number;
}

// Interface for props for the PlayerBoard component
export interface PlayerBoardProps {
  players?: Player[];
  socketId: string | undefined;
}

// Interface for props for displaying messages
export interface MessageProps {
  message: Message[];
  socket: Socket | null;
}

// Interface for a setting with options and current value

type SettingOption = number | string;

export interface Setting {
  name: string;
  options: SettingOption[];
  currentValue: SettingOption;
}

export interface ScoreProps {
  players: Player[];
}

export interface FinalScore {
  name: string;
  totalScore: number;
}
