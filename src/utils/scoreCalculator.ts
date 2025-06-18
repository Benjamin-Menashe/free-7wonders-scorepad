
import { ScoreCategory } from '@/types/game';

const createEmptyScores = (): Record<ScoreCategory, number> => ({
  wonder: 0,
  wealth: 0,
  military: 0,
  culture: 0,
  commerce: 0,
  science: 0,
  guilds: 0
});

export const calculateTotalScore = (scores: Record<ScoreCategory, number> | {}): number => {
  if (!scores || Object.keys(scores).length === 0) {
    return 0;
  }
  return Object.values(scores as Record<ScoreCategory, number>).reduce((total, score) => total + (score || 0), 0);
};

export const calculateCategoryTotal = (
  scores: Record<string, Record<ScoreCategory, number> | {}>,
  category: ScoreCategory
): number => {
  return Object.values(scores).reduce((total, playerScores) => {
    if (!playerScores || Object.keys(playerScores).length === 0) {
      return total;
    }
    return total + ((playerScores as Record<ScoreCategory, number>)[category] || 0);
  }, 0);
};

export const getWinner = (
  players: Array<{ id: string; name: string }>,
  scores: Record<string, Record<ScoreCategory, number> | {}>
): { playerId: string; name: string; score: number } | null => {
  if (players.length === 0) return null;
  
  let winner = { playerId: '', name: '', score: -1 };
  
  players.forEach(player => {
    const playerScores = scores[player.id] || {};
    const totalScore = calculateTotalScore(playerScores);
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
