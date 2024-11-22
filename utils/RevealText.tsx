import React, { useState, useEffect } from "react";

const RevealString = ({
  word,
  hint,
  time,
}: {
  word: string;
  hint: number;
  time: number;
}) => {
  const [displayText, setDisplayText] = useState("_".repeat(word?.length));
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (revealedCount >= hint) return;

    const revealInterval = (time * 1000) / hint; // Convert time to milliseconds

    const revealChar = () => {
      const unrevealedIndexes = [];
      for (let i = 0; i < displayText.length; i++) {
        if (displayText[i] === "_") {
          unrevealedIndexes.push(i);
        }
      }

      if (unrevealedIndexes.length > 0) {
        const randomIndex =
          unrevealedIndexes[
            Math.floor(Math.random() * unrevealedIndexes.length)
          ];

        const newDisplayText =
          displayText.substring(0, randomIndex) +
          word[randomIndex] +
          displayText.substring(randomIndex + 1);

        setDisplayText(newDisplayText);
        setRevealedCount((prevCount) => prevCount + 1);
      }
    };

    const timer = setTimeout(revealChar, revealInterval);

    return () => clearTimeout(timer);
  }, [displayText, revealedCount, word, hint, time]);

  return (
    <div style={{ display: "flex", gap: "5px" }}>
      {displayText &&
        displayText.split("").map((char, index) => (
          <p className="font-bold" key={index}>
            {char}
          </p>
        ))}
    </div>
  );
};

export default RevealString;
