import React from "react";
interface avatar {
  eye: number;
  mouth: number;
  face: number;
}

const GenerateAvatar = ({ eye, mouth, face }: avatar) => {
  const facesPerRow = 10,
    faceWidth = 120,
    faceHeight = 120;
  const eyesPerRow = 10,
    eyeWidth = 100,
    eyeHeight = 101;
  const mouthsPerRow = 10,
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

  return (
    <>
      <div
        className="w-full h-full bg-no-repeat absolute"
        style={{
          backgroundImage: "url(/gif/color_atlas.gif)",
          backgroundSize: `${faceWidth * facesPerRow}px auto`,
          ...calculateBackgroundPosition(
            face ?? 0,
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
            eye ?? 0,
            eyesPerRow,
            eyeWidth,
            eyeHeight
          ),
        }}
      ></div>
      <div
        className="w-[100px] h-[80px] bg-no-repeat absolute bottom-[22%] left-[8%]"
        style={{
          backgroundImage: "url(/gif/mouth_atlas.gif)",
          backgroundSize: `${mouthWidth * mouthsPerRow}px auto`,
          ...calculateBackgroundPosition(
            mouth ?? 0,
            mouthsPerRow,
            mouthWidth,
            mouthHeight
          ),
        }}
      ></div>
    </>
  );
};

export default GenerateAvatar;
