"use client";

import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line, Rect } from "react-konva";
import { getSocket } from "../../app/socket";
import { useParams } from "next/navigation";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useAppSelector } from "../../redux/hooks";

const DrawingBoard: React.FC = () => {
  const [tool, setTool] = useState<"brush" | "eraser">("brush");
  const [lines, setLines] = useState<any[]>([]);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(1);

  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  const containerRef = useRef(null);
  const socket = getSocket();
  const { roomid } = useParams();

  const isPlayerTurn = useAppSelector((state) => state.other.isPlayerTurn);
  const index = useAppSelector((state) => state.other.playerIndex);

  const colors = [
    "#000000",
    "#4d4d4d",
    "#808080",
    "#b3b3b3",
    "#ffffff",
    "#ff0000",
    "#ff6f61",
    "#ffcc00",
    "#f4a261",
    "#ffa500",
    "#ff8c00",
    "#00ff00",
    "#32cd32",
    "#228b22",
    "#007bff",
    "#0000ff",
    "#87cefa",
    "#00ffff",
    "#800080",
    "#9932cc",
    "#ff00ff",
    "#ff69b4",
    "#c71585",
    "#8b4513",
  ];

  useEffect(() => {
    setLines([]);
  }, [index]);

  useEffect(() => {
    socket.on("player:draw", (data) => {
      setLines((prevLines) => [...prevLines, data]);
    });
    socket.on("clear:canvas", (drawindData) => {
      setLines(drawindData);
    });

    return () => {
      socket.off("player:draw");
      socket.off("clear:canvas");
    };
  }, [socket]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    // Add event listener on component mount
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial width
    handleResize();

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = (e: any) => {
    const pos = e.target.getStage().getPointerPosition();
    setIsDrawing(true);
    const newLine = {
      tool,
      color: tool === "eraser" ? "#ffffff" : strokeColor,
      strokeWidth,
      points: [pos.x, pos.y],
    };
    setLines((prevLines) => [...prevLines, newLine]);
  };

  const handleStrokeWidthChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStrokeWidth(Number(event.target.value));
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    if (!lastLine) return;

    lastLine.points = lastLine.points.concat([point.x, point.y]);
    setLines([...lines]);
    socket.emit("player:draw", { drawingData: lastLine, roomid });
  };

  const handleMouseUp = () => setIsDrawing(false);

  const handleClearCanvas = () => {
    setLines([]);
    socket.emit("clear:canvas", roomid);
  };

  const handleUndo = () => {
    setLines((prevLines) => prevLines.slice(0, -1));
  };

  const toggleEraseMode = () => {
    setTool((prevTool) => (prevTool === "eraser" ? "brush" : "eraser"));
  };

  const handleToolClick = (selectedTool: "brush" | "eraser") => {
    setTool(selectedTool);
  };

  return (
    <div className="flex flex-col w-full relative">
      <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
        <Stage
          width={560}
          height={isMobileView ? 270 : 560}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Background Layer */}
          <Layer>
            <Rect width={830} height={600} fill="white" />
          </Layer>

          {/* Drawing Layer */}
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.tool === "eraser" ? "white" : line.color}
                strokeWidth={line.strokeWidth}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>

      {isPlayerTurn && (
        <div className="flex gap-2 justify-between items-center mt-2 md:relative absolute bottom-0 left-0 w-fit">
          <div className="flex flex-wrap w-[150px] md:w-[300px]">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setStrokeColor(color)}
                style={{
                  backgroundColor: color,
                  width: isMobileView ? "12px" : "24px",
                  height: isMobileView ? "12px" : "24px",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
          <div className="flex md:flex-row flex-col  items-center justify-between bg-white text-black p-[3px] rounded-custom">
            <label className="mr-2 font-semibold text-[9px] md:text-base">
              Stroke Width:
            </label>
            <select
              className="border md:rounded-md p-1 text-[7px] md:text-base bg-white text-black "
              value={strokeWidth}
              onChange={handleStrokeWidthChange}
            >
              {[1, 3, 5, 7].map((width) => (
                <option key={width} value={width}>
                  {width}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-1">
            <Tippy content="Brush">
              <div
                className={`rounded-custom flex items-center justify-center ${
                  tool === "brush" ? "bg-purple-500" : "bg-white"
                } transition-transform transform active:scale-90`}
              >
                <button
                  onClick={() => handleToolClick("brush")}
                  style={{
                    width: isMobileView ? "15px" : "32px",
                    height: isMobileView ? "15px" : "32px",
                    background: "url(/gif/pen.gif)",
                    backgroundSize: "contain",
                  }}
                />
              </div>
            </Tippy>
            <Tippy content="Eraser">
              <div
                className={`rounded-custom flex items-center justify-center ${
                  tool === "eraser" ? "bg-purple-500" : "bg-white"
                } transition-transform transform active:scale-90`}
              >
                <button
                  onClick={toggleEraseMode}
                  style={{
                    width: isMobileView ? "16px" : "32px",
                    height: isMobileView ? "16px" : "32px",
                    background: "url(/gif/eraser.gif)",
                    backgroundSize: "contain",
                  }}
                />
              </div>
            </Tippy>
            <Tippy content="Clear Canvas">
              <div className="bg-white rounded-custom flex items-center justify-center transition-transform transform active:scale-90">
                <button
                  onClick={handleClearCanvas}
                  style={{
                    width: isMobileView ? "16px" : "32px",
                    height: isMobileView ? "16px" : "32px",
                    background: "url(/gif/clear.gif)",
                    backgroundSize: "contain",
                  }}
                />
              </div>
            </Tippy>
            <Tippy content="Undo">
              <div className="bg-white rounded-custom flex items-center justify-center transition-transform transform active:scale-90">
                <button
                  onClick={handleUndo}
                  style={{
                    width: isMobileView ? "16px" : "32px",
                    height: isMobileView ? "16px" : "32px",
                    background: "url(/gif/undo.gif)",
                    backgroundSize: "contain",
                  }}
                />
              </div>
            </Tippy>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawingBoard;
