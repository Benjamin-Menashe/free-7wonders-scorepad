
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, X, Sun, Moon } from 'lucide-react';
import { WonderBoard as WonderBoardType, WonderSide, ScoreCategory } from '@/types/game';
import { calculateTotalScore } from '@/utils/scoreCalculator';

interface WonderBoardProps {
  board: WonderBoardType;
  playerName: string;
  wonderSide: WonderSide;
  scores: Record<ScoreCategory, number>;
  onNameChange: (name: string) => void;
  onSideChange: (side: WonderSide) => void;
  onScoreChange: (category: ScoreCategory, value: number) => void;
  onRemove: () => void;
  isEmpty: boolean;
}

const wonderInfo: Record<WonderBoardType, { name: string; description: string }> = {
  alexandria: { name: 'Alexandria', description: 'The Great Library' },
  babylon: { name: 'Babylon', description: 'The Hanging Gardens' },
  ephesus: { name: 'Ephesos', description: 'The Temple of Artemis' },
  giza: { name: 'Gizah', description: 'The Great Pyramid' },
  halicarnassus: { name: 'Halikarnassos', description: 'The Mausoleum' },
  olympia: { name: 'Olympia', description: 'The Statue of Zeus' },
  rhodes: { name: 'Rhodos', description: 'The Colossus' },
};

const scoreCategories: { key: ScoreCategory; name: string; color: string; icon: string }[] = [
  { key: 'wonder', name: 'Wonder Board', color: 'text-amber-600', icon: '🔺' },
  { key: 'wealth', name: 'Wealth', color: 'text-yellow-600', icon: '🪙' },
  { key: 'military', name: 'Military', color: 'text-red-600', icon: '⚔️' },
  { key: 'culture', name: 'Culture', color: 'text-blue-600', icon: '🏛️' },
  { key: 'commerce', name: 'Commerce', color: 'text-yellow-700', icon: '🏪' },
  { key: 'science', name: 'Science', color: 'text-green-600', icon: '⚗️' },
  { key: 'guilds', name: 'Guilds', color: 'text-purple-600', icon: '👥' },
];

const WonderBoard: React.FC<WonderBoardProps> = ({
  board,
  playerName,
  wonderSide,
  scores,
  onNameChange,
  onSideChange,
  onScoreChange,
  onRemove,
  isEmpty,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const totalScore = calculateTotalScore(scores);
  const wonder = wonderInfo[board];

  const handleScoreChange = (category: ScoreCategory, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value) || 0;
    onScoreChange(category, numValue);
  };

  return (
    <Card className="border-2 border-amber-200 shadow-lg">
      {/* Compact Header - Always Visible */}
      <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="flex items-center justify-between gap-2">
          {/* Wonder Name */}
          <div className="font-bold text-sm min-w-0 flex-shrink">
            {wonder.name}
          </div>
          
          {/* Day/Night Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSideChange(wonderSide === 'day' ? 'night' : 'day')}
            className="text-white hover:bg-white/20 p-1 h-auto"
          >
            {wonderSide === 'day' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          {/* Player Name Input */}
          <Input
            value={playerName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Player name"
            className="flex-1 min-w-0 bg-white/90 text-gray-800 placeholder:text-gray-500 border-0 h-8 text-sm"
          />
          
          {/* Expand/Collapse */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-white/20 p-1 h-auto"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          
          {/* Total Score */}
          <div className="font-bold text-lg min-w-0">
            {totalScore}
          </div>
          
          {/* Remove Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-white hover:bg-red-500/50 p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Expanded Scoring Section */}
      {isExpanded && (
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {scoreCategories.map(category => (
                <div key={category.key} className="space-y-1">
                  <label className={`text-sm font-medium ${category.color} flex items-center gap-1`}>
                    <span>{category.icon}</span>
                    {category.name}
                  </label>
                  <Input
                    type="number"
                    value={scores[category.key] || ''}
                    onChange={(e) => handleScoreChange(category.key, e.target.value)}
                    placeholder="0"
                    className="text-center"
                    min="0"
                  />
                </div>
              ))}
            </div>

            {/* Quick Reference Sections */}
            <div className="mt-4 space-y-3">
              <div className="p-3 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2 text-sm">Military Quick Reference</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded text-center">
                    <div className="font-bold text-red-600">Defeats</div>
                    <div className="text-gray-600">-1 pt each</div>
                  </div>
                  <div className="bg-white p-2 rounded text-center">
                    <div className="font-bold text-red-600">Victories</div>
                    <div className="text-gray-600">1/3/5 pts</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2 text-sm">Science Scoring</h4>
                <div className="text-xs text-green-700">
                  <p>• Sets of 3 different: 7 pts</p>
                  <p>• Same symbol: n² points</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default WonderBoard;
