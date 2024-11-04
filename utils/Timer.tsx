import React, { useState, useEffect } from "react";

interface Timer {
  startTime: number;
  onTimeUp: () => void; // Function to be called when the timer reaches zero
}

const Timer = ({ startTime, onTimeUp }: Timer) => {
  const [time, setTime] = useState(startTime);

  useEffect(() => {
    if (time <= 0) {
      onTimeUp(); // Trigger the action when the timer reaches zero
      return;
    }

    const intervalId = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [time, onTimeUp]);

  // Format time (optional) to show as mm:ss
  const formatTime = (time: number) => {
    // const minutes = Math.floor(time / 60);
    const seconds = time;
    return `${String(seconds)}`;
  };

  return <>{formatTime(time)}</>;
};

export default Timer;
