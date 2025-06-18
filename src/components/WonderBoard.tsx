
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
  { key: 'commerce', name: 'Commerce', color: 'text-yellow-700', icon: '🏺' },
  { key: 'science', name: 'Science', color: 'text-green-600', icon: '📖' },
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
  const [expandedCategories, setExpandedCategories] = useState<Record<ScoreCategory, boolean>>({
    wonder: false,
    wealth: false,
    military: false,
    culture: false,
    commerce: false,
    science: false,
    guilds: false
  });
  
  const totalScore = calculateTotalScore(scores);
  const wonder = wonderInfo[board];

  const handleScoreChange = (category: ScoreCategory, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value) || 0;
    onScoreChange(category, numValue);
  };

  const toggleCategoryExpansion = (category: ScoreCategory) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <Card className="border-2 border-amber-200 shadow-lg">
      {/* Compact Header - Always Visible */}
      <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="flex items-center justify-between gap-2">
          {/* Day/Night Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSideChange(wonderSide === 'day' ? 'night' : 'day')}
            className="text-white hover:bg-white/20 p-1 h-auto"
          >
            {wonderSide === 'day' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          {/* Wonder Name */}
          <div className="font-bold text-sm min-w-0 flex-shrink">
            {wonder.name}
          </div>
          
          {/* Player Name Input - Fixed width for alignment */}
          <Input
            value={playerName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Player name"
            className="w-32 bg-white/90 text-gray-800 placeholder:text-gray-500 border-0 h-8 text-sm"
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
          <div className="space-y-2">
            {scoreCategories.map(category => (
              <div key={category.key} className="border rounded-lg overflow-hidden">
                {/* Category Header - Full Line */}
                <div 
                  className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleCategoryExpansion(category.key)}
                >
                  <div className={`flex items-center gap-2 font-medium ${category.color}`}>
                    <span>{category.icon}</span>
                    {category.name}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={scores[category.key] || ''}
                      onChange={(e) => handleScoreChange(category.key, e.target.value)}
                      placeholder="0"
                      className="w-16 text-center h-8"
                      min="0"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                    >
                      {expandedCategories[category.key] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Expanded Category Details */}
                {expandedCategories[category.key] && (
                  <div className="p-3 bg-white border-t">
                    <p className="text-sm text-gray-600">
                      Enter individual victory point components for {category.name.toLowerCase()}
                    </p>
                    {/* Additional inputs for detailed scoring could go here */}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default WonderBoard;
