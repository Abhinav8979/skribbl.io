"use client";
import React, { useState } from "react";
import Canvas from "../../components/drawing canvas/Canvas";
import PrivateRoomLayout from "../../layout/PrivateRoomLayout";

const DrawPage: React.FC = () => {
  const [canvasData, setCanvasData] = useState<any>(null);

  const saveDrawingData = (data: any) => {
    setCanvasData(data);
  };

  //   const handleSaveToLocalStorage = () => {
  //     if (canvasData) {
  //       localStorage.setItem("drawingData", JSON.stringify(canvasData));
  //       alert("Drawing saved!");
  //     }
  //   };

  return (
    <PrivateRoomLayout>
      <div>
        <Canvas
          setCanvasData={saveDrawingData}
          {...(localStorage.getItem("drawingData")
            ? {
                initialData: JSON.parse(
                  localStorage.getItem("drawingData") as string
                ),
              }
            : {})}
        />

        {canvasData && (
          <div className="mt-4">
            <h2 className="font-semibold">Saved Drawing Data:</h2>
            <pre className="bg-gray-200 p-2 rounded">
              {JSON.stringify(canvasData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </PrivateRoomLayout>
  );
};

export default DrawPage;
