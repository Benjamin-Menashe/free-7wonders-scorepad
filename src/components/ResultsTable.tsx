
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, RotateCcw, Calculator } from 'lucide-react';
import { Player, ScoreCategory } from '@/types/game';
import { calculateTotalScore } from '@/utils/scoreCalculator';

interface ResultsTableProps {
  players: Player[];
  scores: Record<string, Record<ScoreCategory, number>>;
  onBackToSetup: () => void;
  onBackToScoring: () => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  players,
  scores,
  onBackToSetup,
  onBackToScoring,
}) => {
  const getPlayerResults = () => {
    return players
      .map(player => ({
        ...player,
        totalScore: calculateTotalScore(scores[player.id] || {}),
        categoryScores: scores[player.id] || {}
      }))
      .sort((a, b) => b.totalScore - a.totalScore);
  };

  const playerResults = getPlayerResults();
  const winner = playerResults[0];

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1: return <Medal className="w-6 h-6 text-gray-400" />;
      case 2: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <div className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">{index + 1}</div>;
    }
  };

  const categories: { key: ScoreCategory; name: string; color: string; icon: string }[] = [
    { key: 'wonder', name: 'Wonder', color: 'text-amber-600', icon: '🔺' },
    { key: 'wealth', name: 'Wealth', color: 'text-yellow-600', icon: '🪙' },
    { key: 'military', name: 'Military', color: 'text-red-600', icon: '⚔️' },
    { key: 'culture', name: 'Culture', color: 'text-blue-600', icon: '🏛️' },
    { key: 'commerce', name: 'Commerce', color: 'text-yellow-700', icon: '🏪' },
    { key: 'science', name: 'Science', color: 'text-green-600', icon: '⚗️' },
    { key: 'guilds', name: 'Guilds', color: 'text-purple-600', icon: '👥' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Winner Announcement */}
      <Card className="border-4 border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50 shadow-2xl">
        <CardHeader className="text-center bg-gradient-to-r from-yellow-400 to-amber-500 text-white">
          <CardTitle className="text-3xl flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8" />
            Victory Achieved!
            <Trophy className="w-8 h-8" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <h2 className="text-4xl font-bold text-amber-900 mb-2">{winner.name}</h2>
          <p className="text-xl text-amber-700 mb-4">
            Rules {winner.wonderBoard.charAt(0).toUpperCase() + winner.wonderBoard.slice(1)} with {winner.totalScore} points!
          </p>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Wonder of {winner.wonderBoard.charAt(0).toUpperCase() + winner.wonderBoard.slice(1)} ({winner.wonderSide} side)
          </Badge>
        </CardContent>
      </Card>

      {/* Detailed Results Table */}
      <Card className="shadow-xl">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
          <CardTitle className="text-2xl">Final Scores</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Rank</th>
                  <th className="px-4 py-3 text-left font-semibold">Player</th>
                  <th className="px-4 py-3 text-left font-semibold">Wonder</th>
                  {categories.map(category => (
                    <th key={category.key} className={`px-3 py-3 text-center font-semibold ${category.color}`}>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-xs">{category.name}</span>
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center font-semibold text-gray-900 bg-yellow-100">
                    <div className="flex flex-col items-center gap-1">
                      <Trophy className="w-5 h-5" />
                      <span>Total</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {playerResults.map((player, index) => (
                  <tr 
                    key={player.id} 
                    className={`border-b ${index === 0 ? 'bg-yellow-50 border-yellow-200' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(index)}
                        <span className="font-semibold text-gray-700">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">{player.name}</div>
                        <div className="text-sm text-gray-500">
                          {player.wonderBoard.charAt(0).toUpperCase() + player.wonderBoard.slice(1)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={player.wonderSide === 'day' ? 'default' : 'secondary'}>
                        {player.wonderSide} side
                      </Badge>
                    </td>
                    {categories.map(category => (
                      <td key={category.key} className="px-3 py-4 text-center">
                        <span className={`font-semibold ${category.color}`}>
                          {player.categoryScores[category.key] || 0}
                        </span>
                      </td>
                    ))}
                    <td className={`px-4 py-4 text-center font-bold text-xl ${index === 0 ? 'text-yellow-700 bg-yellow-100' : 'text-gray-900'}`}>
                      {player.totalScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button onClick={onBackToScoring} variant="outline" className="flex items-center gap-2">
          <Calculator className="w-4 h-4" />
          Edit Scores
        </Button>
        <Button onClick={onBackToSetup} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <RotateCcw className="w-4 h-4" />
          New Game
        </Button>
      </div>
    </div>
  );
};

export default ResultsTable;
