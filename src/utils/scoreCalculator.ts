
import { ScoreCategory } from '@/types/game';

export const calculateTotalScore = (scores: Record<ScoreCategory, number> | {}): number => {
  if (!scores || Object.keys(scores).length === 0) {
    return 0;
  }
  const typedScores = scores as Record<ScoreCategory, number>;
  return Object.values(typedScores).reduce((total, score) => total + (score || 0), 0);
};

export const calculateCategoryTotal = (
  scores: Record<string, Record<ScoreCategory, number> | {}>,
  category: ScoreCategory
): number => {
  return Object.values(scores).reduce((total, playerScores) => {
    if (!playerScores || Object.keys(playerScores).length === 0) {
      return total;
    }
    const typedPlayerScores = playerScores as Record<ScoreCategory, number>;
    return total + (typedPlayerScores[category] || 0);
  }, 0);
};

export const getWinner = (
  players: Array<{ id: string; name: string; scores: Record<ScoreCategory, number> | {} }>,
): { playerId: string; name: string; score: number } | null => {
  if (players.length === 0) return null;
  
  let winner = { playerId: '', name: '', score: -1 };
  
  players.forEach(player => {
    const totalScore = calculateTotalScore(player.scores);
    if (totalScore > winner.score) {
      winner = {
        playerId: player.id,
        name: player.name,
        score: totalScore
      };
    }
  });
  
  return winner.score >= 0 ? winner : null;
};
