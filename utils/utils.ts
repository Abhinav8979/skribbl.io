import { words } from "./skribblWords";

export function generateRoomID(length = 8): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let roomID = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomID += characters[randomIndex];
  }
  return roomID;
}

export function generateRandomWords(totalWords: number) {
  const lengths = Object.keys(words)
    .map(Number)
    .filter((length) => length >= 3 && length <= 19);

  const randomWords: string[] = [];

  for (let i = 0; i < totalWords; i++) {
    const randomLength = lengths[Math.floor(Math.random() * lengths.length)];
    const wordGroup = words[randomLength.toString()];

    const randomWord = wordGroup[Math.floor(Math.random() * wordGroup.length)];
    randomWords.push(randomWord);
  }

  return randomWords;
}
