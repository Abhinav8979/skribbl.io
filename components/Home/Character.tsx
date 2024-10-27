"use client";

import React, { useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { setAvatar } from "../../redux/actions/allActions";

interface ArrowColorState {
  face: {
    left: boolean;
    right: boolean;
  };
  eye: {
    left: boolean;
    right: boolean;
  };
  mouth: {
    left: boolean;
    right: boolean;
  };
}

const Character = () => {
  const [currentFaceIndex, setCurrentFaceIndex] = useState(0);
  const [currentEyeIndex, setCurrentEyeIndex] = useState(0);
  const [currentMouthIndex, setCurrentMouthIndex] = useState(0);
  const [changeArrowColor, setChangeArrowColor] = useState<ArrowColorState>({
    face: {
      left: false,
      right: false,
    },
    eye: {
      left: false,
      right: false,
    },
    mouth: {
      left: false,
      right: false,
    },
  });
  const dispatch = useAppDispatch();

  const facesPerRow = 10;
  const totalFaces = 28;
  const faceWidth = 120;
  const faceHeight = 120;

  const showFace = (index: number) => {
    const row = Math.floor(index / facesPerRow);
    const col = index % facesPerRow;
    return {
      backgroundPosition: `-${col * faceWidth}px -${row * faceHeight}px`,
    };
  };

  const itemsPerRow = 10;
  const eyeWidth = 100;
  //   const eyeHeight = 80;

  const showAtlas = (index: number) => {
    return {
      backgroundPosition: `-${index * eyeWidth}px 0px`,
    };
  };

  const nextIndex = (currentIndex: number, total: number) => {
    return (currentIndex + 1) % total;
  };

  const prevIndex = (currentIndex: number, total: number) => {
    return (currentIndex - 1 + total) % total;
  };

  const setArrowColor = (
    propName: keyof ArrowColorState,
    arrowDirection: "left" | "right"
  ) => {
    setChangeArrowColor((prevState: ArrowColorState) => ({
      ...prevState,
      [propName]: {
        left: arrowDirection === "left",
        right: arrowDirection === "right",
      },
    }));
  };

  const setArrowColorToZero = (propName: keyof ArrowColorState) => {
    setChangeArrowColor((prev: ArrowColorState) => ({
      ...prev,
      [propName]: {
        left: false,
        right: false,
      },
    }));
  };

  const onEye = () => {
    setCurrentEyeIndex(prevIndex(currentEyeIndex, itemsPerRow));
    dispatch(
      setAvatar({
        face: currentFaceIndex,
        eye: currentEyeIndex,
        mouth: currentMouthIndex,
      })
    );
  };

  const onMouth = () => {
    setCurrentMouthIndex(prevIndex(currentMouthIndex, itemsPerRow));
    console.log(currentMouthIndex);
    dispatch(
      setAvatar({
        face: currentFaceIndex,
        eye: currentEyeIndex,
        mouth: currentMouthIndex,
      })
    );
  };

  const onFace = () => {
    setCurrentFaceIndex(prevIndex(currentFaceIndex, totalFaces));
    dispatch(
      setAvatar({
        face: currentFaceIndex,
        eye: currentEyeIndex,
        mouth: currentMouthIndex,
      })
    );
  };

  return (
    <div className="relative flex items-center justify-center  bg-blue-800 p-2">
      {/* LEFT ARROW */}

      <div className="absolute left-[20%] bottom-0 flex flex-col space-y-2 transform">
        <div className="w-[29px] h-[28px] relative overflow-hidden">
          <div
            onClick={onEye}
            onMouseEnter={() => setArrowColor("eye", "left")}
            onMouseLeave={() => setArrowColorToZero("eye")}
            style={{
              backgroundImage: "url(/gif/arrow.gif)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              width: "55px",
              height: "58px",
              transform: `translateX(${changeArrowColor.eye.left ? -29 : 0}px)`,
            }}
            className="cursor-pointer"
          ></div>
        </div>

        <div className="w-[29px] h-[28px] relative overflow-hidden">
          <div
            onClick={onMouth}
            onMouseEnter={() => setArrowColor("mouth", "left")}
            onMouseLeave={() => setArrowColorToZero("mouth")}
            style={{
              backgroundImage: "url(/gif/arrow.gif)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              width: "55px",
              height: "58px",
              transform: `translateX(${
                changeArrowColor.mouth.left ? -29 : 0
              }px)`,
            }}
            className="cursor-pointer"
          ></div>
        </div>

        <div className="w-[29px] h-[28px] relative overflow-hidden">
          <div
            onClick={onFace}
            onMouseEnter={() => setArrowColor("face", "left")}
            onMouseLeave={() => setArrowColorToZero("face")}
            style={{
              backgroundImage: "url(/gif/arrow.gif)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              width: "55px",
              height: "58px",
              transform: `translateX(${
                changeArrowColor.face.left ? -29 : 0
              }px)`,
            }}
            className="cursor-pointer"
          ></div>
        </div>
      </div>

      {/* CHARACTER */}

      <div className="w-[120px] h-[120px] overflow-hidden mx-auto relative">
        <div
          className="w-full h-full bg-no-repeat z-10 absolute"
          style={{
            backgroundImage: "url(/gif/color_atlas.gif)",
            backgroundSize: `${faceWidth * facesPerRow}px auto`,
            ...showFace(currentFaceIndex),
          }}
        ></div>
        <div
          className="w-[100px] h-[80px] bg-no-repeat z-30 absolute top-[10%] left-[6%]"
          style={{
            backgroundImage: "url(/gif/eyes_atlas.gif)",
            backgroundSize: `${eyeWidth * itemsPerRow}px auto`,
            ...showAtlas(currentEyeIndex),
          }}
        ></div>
        <div
          className="w-[100px] h-[80px] bg-no-repeat z-30 absolute bottom-[22%] left-[8%]"
          style={{
            backgroundImage: "url(/gif/mouth_atlas.gif)",
            backgroundSize: `${eyeWidth * itemsPerRow}px auto`,
            ...showAtlas(currentMouthIndex),
          }}
        ></div>
      </div>

      {/* RIGHT ARROW */}

      <div className="absolute right-[20%] bottom-0 flex flex-col space-y-2 transform rotate-180">
        <div className="w-[29px] h-[28px] relative overflow-hidden">
          <div
            onClick={onFace}
            onMouseEnter={() => setArrowColor("face", "right")}
            onMouseLeave={() => setArrowColorToZero("face")}
            style={{
              backgroundImage: "url(/gif/arrow.gif)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              width: "55px",
              height: "58px",
              transform: `translateX(${
                changeArrowColor.face.right ? -29 : 0
              }px)`,
            }}
            className="cursor-pointer"
          ></div>
        </div>

        <div className="w-[29px] h-[28px] relative overflow-hidden">
          <div
            onClick={onMouth}
            onMouseEnter={() => setArrowColor("mouth", "right")}
            onMouseLeave={() => setArrowColorToZero("mouth")}
            style={{
              backgroundImage: "url(/gif/arrow.gif)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              width: "55px",
              height: "58px",
              transform: `translateX(${
                changeArrowColor.mouth.right ? -29 : 0
              }px)`,
            }}
            className="cursor-pointer"
          ></div>
        </div>

        <div className="w-[29px] h-[28px] overflow-hidden">
          <div
            onClick={onEye}
            onMouseEnter={() => setArrowColor("eye", "right")}
            onMouseLeave={() => setArrowColorToZero("eye")}
            style={{
              backgroundImage: "url(/gif/arrow.gif)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              width: "55px",
              height: "58px",
              transform: `translateX(${
                changeArrowColor.eye.right ? -29 : 0
              }px)`,
            }}
            className="cursor-pointer"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Character;
