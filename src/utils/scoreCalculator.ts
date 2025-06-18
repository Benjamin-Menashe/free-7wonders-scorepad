
import { ScoreCategory } from '@/types/game';

export const calculateTotalScore = (scores: Record<ScoreCategory, number>): number => {
  return Object.values(scores).reduce((total, score) => total + (score || 0), 0);
};

export const calculateCategoryTotal = (
  scores: Record<string, Record<ScoreCategory, number>>,
  category: ScoreCategory
): number => {
  return Object.values(scores).reduce((total, playerScores) => {
    return total + (playerScores[category] || 0);
  }, 0);
};

export const getWinner = (
  players: Array<{ id: string; name: string }>,
  scores: Record<string, Record<ScoreCategory, number>>
): { playerId: string; name: string; score: number } | null => {
  if (players.length === 0) return null;
  
  let winner = { playerId: '', name: '', score: -1 };
  
  players.forEach(player => {
    const totalScore = calculateTotalScore(scores[player.id] || {});
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
