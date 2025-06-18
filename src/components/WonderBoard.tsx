
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Trash2, Sun, Moon } from 'lucide-react';
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
  onDelete: () => void;
  isEmpty: boolean;
}

const wonderInfo: Record<WonderBoardType, { name: string; description: string }> = {
  alexandria: { name: 'Alexandria', description: 'The Great Library' },
  babylon: { name: 'Babylon', description: 'The Hanging Gardens' },
  ephesus: { name: 'Ephesus', description: 'The Temple of Artemis' },
  giza: { name: 'Giza', description: 'The Great Pyramid' },
  halicarnassus: { name: 'Halicarnassus', description: 'The Mausoleum' },
  olympia: { name: 'Olympia', description: 'The Statue of Zeus' },
  rhodes: { name: 'Rhodes', description: 'The Colossus' },
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
  onDelete,
  isEmpty,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const totalScore = calculateTotalScore(scores);
  const wonder = wonderInfo[board];

  const handleScoreChange = (category: ScoreCategory, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value) || 0;
    onScoreChange(category, numValue);
  };

  if (isEmpty) {
    return (
      <Card className="border-2 border-dashed border-gray-300 bg-gray-50 h-32 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-sm">Empty Wonder Board</div>
          <div className="text-xs">{wonder.name}</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-amber-200 shadow-lg">
      <CardHeader 
        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-xl">🏛️</span>
              {wonder.name}
            </CardTitle>
            <div className="text-sm opacity-90">{wonder.description}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm opacity-90">Total</div>
              <div className="text-2xl font-bold">{totalScore}</div>
            </div>
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Player Name and Controls */}
        <div className="flex items-center gap-2 mb-4">
          <Input
            value={playerName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Player name"
            className="flex-1"
          />
          <Button
            variant={wonderSide === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSideChange(wonderSide === 'day' ? 'night' : 'day')}
            className="flex items-center gap-1"
          >
            {wonderSide === 'day' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {wonderSide}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Expanded Scoring Section */}
        {isExpanded && (
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
        )}
      </CardContent>
    </Card>
  );
};

export default WonderBoard;
