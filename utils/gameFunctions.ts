type Player = {
  id: string; // Unique identifier for each player
  guessTime: number; // Time in seconds when the player guessed correctly
  guessOrder: number; // Order in which the player guessed (1 for first, 2 for second, etc.)
};

type GameResult = {
  playerId: string;
  points: number;
}[];

export const calculateScores = (
  players: Player[],
  gameTime: number,
  maxPoints: number = 200,
  minPoints: number = 50
): { guesserScores: GameResult; drawerScore: number } => {
  // Calculate the time-based deduction rate
  const deductionRate = (maxPoints * 0.5) / gameTime;

  // Calculate scores for each player based on their guess time and order
  const guesserScores: GameResult = players.map((player) => {
    // Base points for this player as the first guesser
    const timePenalty = player.guessTime * deductionRate;
    let playerPoints = maxPoints - timePenalty;

    // Apply order penalty for subsequent guessers
    playerPoints -= (player.guessOrder - 1) * 20; // Deduct 20 points per guess order

    // Ensure points do not go below the minimum score
    playerPoints = Math.max(playerPoints, minPoints);

    return { playerId: player.id, points: Math.round(playerPoints) };
  });

  // Calculate the drawer's score based on the number of correct guesses
  const correctGuesses = players.length;
  const baseDrawerPoints = 50; // Base points for the drawer
  const bonusPerGuess = 10; // Bonus points for each correct guess
  const drawerScore = baseDrawerPoints + correctGuesses * bonusPerGuess;

  return {
    guesserScores,
    drawerScore,
  };
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
