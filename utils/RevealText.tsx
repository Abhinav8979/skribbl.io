import React, { useState, useEffect } from "react";

const RevealString = ({ word, hint }: { word: string; hint: number }) => {
  const [displayText, setDisplayText] = useState("_".repeat(word?.length));
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (revealedCount >= hint) return;

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

    const timer = setTimeout(revealChar, 1000);

    return () => clearTimeout(timer);
  }, [displayText, revealedCount, word, hint]);

  return (
    <>
      <h1>
        {displayText &&
          displayText.split("").map((char, index) => (
            <span className="mx-1 font-semibold" key={index}>
              {char}
            </span>
          ))}
      </h1>
    </>
  );
};

export default RevealString;
