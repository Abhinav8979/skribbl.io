import React, { useState, useEffect } from "react";

interface Timer {
  startTime: number;
  onTimeUp: () => void;
}

const Timer = ({ startTime, onTimeUp }: Timer) => {
  const [time, setTime] = useState(startTime);

  useEffect(() => {
    if (time <= 0) {
      onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [time]);

  const formatTime = (time: number) => {
    const seconds = time;
    return `${String(seconds)}`;
  };

  return <>{formatTime(time)}</>;
};

export default Timer;
