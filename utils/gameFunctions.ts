interface PlayerInfo {
  guessTime: number;
  guessOrder: number;
}

export const calculateScores = (
  playerInfo: PlayerInfo,
  gameTime: number
): number => {
  const maxPoints = 200;
  const deductionRate = (maxPoints * 0.5) / gameTime; // Deduction rate based on game time
  const timePenalty = playerInfo.guessTime * deductionRate;

  // Points decrease for subsequent correct guesses (20 points less for each additional guesser)
  const orderPenalty = 20 * playerInfo.guessOrder;

  // Calculate total score for this player and round down to the nearest integer
  return Math.max(Math.floor(maxPoints - timePenalty - orderPenalty), 0);
};

export function levenshteinDistance({ a, b }: { a: string; b: string }) {
  const matrix = Array.from({ length: b.length + 1 }, () =>
    Array(a.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      if (b[j - 1] === a[i - 1]) matrix[j][i] = matrix[j - 1][i - 1];
      else
        matrix[j][i] =
          Math.min(matrix[j - 1][i - 1], matrix[j][i - 1], matrix[j - 1][i]) +
          1;
    }
  }
  return matrix[b.length][a.length];
}

// const threshold = 2; // Customize threshold as needed
// const distance = levenshteinDistance(guess, target);
// const hint = distance <= threshold ? "You're very close!" : "Keep trying!";
