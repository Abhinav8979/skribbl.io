"use client";

import PlayerDrawingBoard from "../../../components/drawing canvas/PlayerDrawingBoard";
import GameSetting from "../../../components/GameSetting";
import { useAppSelector } from "../../../redux/hooks";

export default function Page() {
  const play = useAppSelector((state) => state.other.Play);

  return <>{!play ? <GameSetting /> : <PlayerDrawingBoard />}</>;
}
