"use client";

import React, { useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { setAvatar } from "../../redux/actions/allActions";
import { ArrowColorState } from "../../utils/tsTypes";

const Character = () => {
  const [currentFaceIndex, setCurrentFaceIndex] = useState(0);
  const [currentEyeIndex, setCurrentEyeIndex] = useState(0);
  const [currentMouthIndex, setCurrentMouthIndex] = useState(0);
  const [changeArrowColor, setChangeArrowColor] = useState<ArrowColorState>({
    face: { left: false, right: false },
    eye: { left: false, right: false },
    mouth: { left: false, right: false },
  });
  const dispatch = useAppDispatch();

  const facesPerRow = 10,
    totalFaces = 27,
    faceWidth = 120,
    faceHeight = 120;

  const eyesPerRow = 10,
    totalEyes = 57,
    eyeWidth = 100,
    eyeHeight = 101;

  const mouthsPerRow = 10,
    totalMouths = 51,
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

  const nextIndex = (currentIndex: number, total: number) =>
    (currentIndex + 1) % total;
  const prevIndex = (currentIndex: number, total: number) =>
    (currentIndex - 1 + total) % total;

  const setArrowColor = (
    propName: keyof ArrowColorState,
    arrowDirection: "left" | "right"
  ) => {
    setChangeArrowColor((prevState) => ({
      ...prevState,
      [propName]: {
        left: arrowDirection === "left",
        right: arrowDirection === "right",
      },
    }));
  };

  const resetArrowColor = (propName: keyof ArrowColorState) => {
    setChangeArrowColor((prev) => ({
      ...prev,
      [propName]: { left: false, right: false },
    }));
  };

  const updateIndex = (
    type: "face" | "eye" | "mouth",
    direction: "left" | "right"
  ) => {
    let newIndex: number;
    const setter = {
      face: setCurrentFaceIndex,
      eye: setCurrentEyeIndex,
      mouth: setCurrentMouthIndex,
    }[type];
    const currentIndex = {
      face: currentFaceIndex,
      eye: currentEyeIndex,
      mouth: currentMouthIndex,
    }[type];
    const totalItems = { face: totalFaces, eye: totalEyes, mouth: totalMouths }[
      type
    ];

    newIndex =
      direction === "left"
        ? prevIndex(currentIndex, totalItems)
        : nextIndex(currentIndex, totalItems);
    setter(newIndex);

    dispatch(
      setAvatar({
        face: currentFaceIndex,
        eye: currentEyeIndex,
        mouth: currentMouthIndex,
      })
    );
  };

  return (
    <div className="relative flex items-center justify-center bg-blue-800 p-2">
      {/* Left Arrow Buttons */}
      <div className="absolute  left-[12%] bottom-3 md:left-[22%]  flex flex-col space-y-2">
        {["eye", "mouth", "face"].map((type) => (
          <div
            key={type}
            className="w-[29px] h-[28px] relative overflow-hidden"
          >
            <div
              onClick={() =>
                updateIndex(type as "face" | "eye" | "mouth", "left")
              }
              onMouseEnter={() =>
                setArrowColor(type as keyof ArrowColorState, "left")
              }
              onMouseLeave={() =>
                resetArrowColor(type as keyof ArrowColorState)
              }
              style={{
                backgroundImage: "url(/gif/arrow.gif)",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                width: "55px",
                height: "58px",
                transform: `translateX(${
                  changeArrowColor[type as keyof ArrowColorState].left ? -29 : 0
                }px)`,
              }}
              className="cursor-pointer"
            ></div>
          </div>
        ))}
      </div>

      {/* Character Images */}
      <div className="w-[120px] h-[120px] overflow-hidden mx-auto relative">
        <div
          className="w-full h-full bg-no-repeat absolute"
          style={{
            backgroundImage: "url(/gif/color_atlas.gif)",
            backgroundSize: `${faceWidth * facesPerRow}px auto`,
            ...calculateBackgroundPosition(
              currentFaceIndex,
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
              currentEyeIndex,
              eyesPerRow,
              eyeWidth,
              eyeHeight
            ),
          }}
        ></div>
        <div
          className="w-[100px] h-[80px] bg-no-repeat absolute bottom-[20%] left-[8%]"
          style={{
            backgroundImage: "url(/gif/mouth_atlas.gif)",
            backgroundSize: `${mouthWidth * mouthsPerRow}px auto`,
            ...calculateBackgroundPosition(
              currentMouthIndex,
              mouthsPerRow,
              mouthWidth,
              mouthHeight
            ),
          }}
        ></div>
      </div>

      {/* Right Arrow Buttons */}
      <div className="absolute right-[12%] bottom-3 md:right-[22%]  flex flex-col space-y-2 rotate-180">
        {["face", "mouth", "eye"].map((type) => (
          <div
            key={type}
            className="w-[29px] h-[28px] relative overflow-hidden"
          >
            <div
              onClick={() =>
                updateIndex(type as "face" | "eye" | "mouth", "right")
              }
              onMouseEnter={() =>
                setArrowColor(type as keyof ArrowColorState, "right")
              }
              onMouseLeave={() =>
                resetArrowColor(type as keyof ArrowColorState)
              }
              style={{
                backgroundImage: "url(/gif/arrow.gif)",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                width: "55px",
                height: "58px",
                transform: `translateX(${
                  changeArrowColor[type as keyof ArrowColorState].right
                    ? -29
                    : 0
                }px)`,
              }}
              className="cursor-pointer"
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Character;
