
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Player, ScoreCategory } from '@/types/game';

interface ScoringSection {
  category: {
    key: ScoreCategory;
    name: string;
    color: string;
    icon: string;
  };
  players: Player[];
  scores: Record<string, Record<ScoreCategory, number>>;
  updateScore: (playerId: string, category: ScoreCategory, value: number) => void;
}

const ScoringSection: React.FC<ScoringSection> = ({
  category,
  players,
  scores,
  updateScore,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleScoreChange = (playerId: string, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value) || 0;
    updateScore(playerId, category.key, numValue);
  };

  const getTotalForCategory = () => {
    return players.reduce((total, player) => {
      return total + (scores[player.id]?.[category.key] || 0);
    }, 0);
  };

  return (
    <Card className="border-2 border-gray-200 shadow-lg overflow-hidden">
      <CardHeader 
        className={`${category.color} text-white cursor-pointer hover:opacity-90 transition-opacity`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-3">
            <span className="text-2xl">{category.icon}</span>
            {category.name}
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm opacity-90">Total Points</div>
              <div className="text-2xl font-bold">{getTotalForCategory()}</div>
            </div>
            {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map(player => (
              <div key={player.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {player.name}
                  <span className="text-xs text-gray-500 ml-2">
                    ({player.wonderBoard})
                  </span>
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={scores[player.id]?.[category.key] || ''}
                    onChange={(e) => handleScoreChange(player.id, e.target.value)}
                    placeholder="0"
                    className="text-center text-lg font-semibold border-2 focus:border-amber-400"
                    min="0"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                    pts
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick Actions for common categories */}
          {category.key === 'military' && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-800 mb-3">Military Quick Reference</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="bg-white p-2 rounded text-center">
                  <div className="font-bold text-red-600">6 Defeats</div>
                  <div className="text-gray-600">-6 pts</div>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <div className="font-bold text-red-600">1-2 Victories</div>
                  <div className="text-gray-600">1-3 pts</div>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <div className="font-bold text-red-600">3-4 Victories</div>
                  <div className="text-gray-600">3-5 pts</div>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <div className="font-bold text-red-600">5-6 Victories</div>
                  <div className="text-gray-600">5-10 pts</div>
                </div>
              </div>
            </div>
          )}

          {category.key === 'science' && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-3">Science Scoring</h4>
              <div className="text-sm text-green-700">
                <p>• Each set of 3 different symbols: 7 points</p>
                <p>• Pairs of same symbol: 1, 4, 9, 16, 25, 36... points</p>
                <p>• Calculate: (Tablet²) + (Compass²) + (Gear²) + (Sets × 7)</p>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default ScoringSection;
