"use client";

import React, { useRef, useState, useEffect } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

interface CanvasProps {
  setCanvasData: (data: any) => void;
  initialData?: any;
}

const Canvas: React.FC<CanvasProps> = ({ setCanvasData, initialData }) => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [strokeColor, setStrokeColor] = useState("black");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [eraseMode, setEraseMode] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

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
    if (initialData && initialData.length > 0) {
      canvasRef.current?.loadPaths(initialData);
    }
  }, [initialData]);

  const handleSaveDrawing = async () => {
    try {
      const drawingData = await canvasRef.current?.exportPaths();
      if (drawingData) {
        setCanvasData(drawingData);
      }
    } catch (error) {
      console.error("Error saving drawing:", error);
    }
  };

  const handleClearCanvas = () => {
    canvasRef.current?.clearCanvas();
    setSelectedTool("clear");
  };

  const handleUndo = () => {
    canvasRef.current?.undo();
    setSelectedTool("undo");
  };

  const toggleEraseMode = () => {
    setEraseMode(!eraseMode);
    setSelectedTool("erase");
    setStrokeColor("white");
  };

  const toggleBrushMode = () => {
    setEraseMode(false);
    setSelectedTool("brush");
    setStrokeColor("black");
  };

  return (
    <section className="relative">
      <ReactSketchCanvas
        ref={canvasRef}
        strokeWidth={strokeWidth}
        strokeColor={eraseMode ? "white" : strokeColor}
        width="100%"
        height="500px"
        style={{
          border: "1px solid #000",
          borderRadius: "8px",
        }}
      />

      <div className="space-y-2">
        <div className="flex gap-2 justify-between items-center ">
          <div className="mt-4">
            <div className="flex flex-wrap w-[300px]">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setStrokeColor(color);
                    setEraseMode(false);
                    setSelectedTool(null);
                  }}
                  style={{
                    backgroundColor: color,
                    width: "24px",
                    height: "24px",
                    border:
                      strokeColor === color && !eraseMode
                        ? "2px solid #000"
                        : "2px solid transparent",
                    cursor: "pointer",
                  }}
                ></button>
              ))}
            </div>
          </div>

          <div className="flex gap-1">
            <Tippy content="Brush">
              <div
                style={{
                  backgroundColor:
                    selectedTool === "brush" ? "purple" : "white",
                }}
                className="p-1 rounded-custom flex items-center"
              >
                <button
                  onClick={toggleBrushMode}
                  style={{
                    backgroundImage: "url(/gif/pen.gif)",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    width: "32px",
                    height: "32px",

                    transform: "scale(1)",
                    transition: "transform 0.1s",
                  }}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "scale(0.9)")
                  }
                  onMouseUp={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></button>
              </div>
            </Tippy>
            <Tippy content="Clear Canvas">
              <div
                style={{
                  backgroundColor:
                    selectedTool === "clear" ? "purple" : "white",
                }}
                className="p-1 rounded-custom flex items-center"
              >
                <button
                  onClick={handleClearCanvas}
                  style={{
                    backgroundImage: "url(/gif/clear.gif)",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    width: "32px",
                    height: "32px",

                    transform: "scale(1)",
                    transition: "transform 0.1s",
                  }}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "scale(0.9)")
                  }
                  onMouseUp={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></button>
              </div>
            </Tippy>
          </div>

          <div className="flex gap-1">
            <Tippy content="Undo">
              <div
                style={{
                  backgroundColor: selectedTool === "undo" ? "purple" : "white",
                }}
                className="p-1 rounded-custom flex items-center"
              >
                <button
                  onClick={handleUndo}
                  style={{
                    backgroundImage: "url(/gif/undo.gif)",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    width: "32px",
                    height: "32px",

                    transform: "scale(1)",
                    transition: "transform 0.1s",
                  }}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "scale(0.9)")
                  }
                  onMouseUp={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></button>
              </div>
            </Tippy>

            <Tippy content="Toggle Erase Mode">
              <div
                style={{
                  backgroundColor:
                    selectedTool === "erase" ? "purple" : "white",
                }}
                className="rounded-custom flex items-center"
              >
                <button
                  onClick={toggleEraseMode}
                  style={{
                    backgroundImage: "url(/gif/eraser.gif)",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    width: "32px",
                    height: "32px",
                    transform: "scale(1)",
                    transition: "transform 0.1s",
                  }}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "scale(0.9)")
                  }
                  onMouseUp={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></button>
              </div>
            </Tippy>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Canvas;
